import {
	HttpMethod,
	HttpResponse,
	OverpassQueryBuilder,
	OverpassQueryValidator,
	OverpassStatusValidator,
	RequestAdapter,
} from "@/imp/types";
import {
	AnyParamValue,
	ArgTypes,
	CompileUtils,
	CompiledItem,
	CreateFunctionArgs,
	CreateFunctionContext,
	OverpassApiFunction,
	OverpassApiObject,
	OverpassApiOutput,
	OverpassFilterBuilder,
	OverpassFormat,
	OverpassItemEvaluatorBuilder,
	OverpassJsonOutput,
	OverpassJsonSettings,
	OverpassOutputOptions,
	OverpassSettings,
	OverpassSettingsNoFormat,
	OverpassState,
	OverpassStatement,
	OverpassStatus,
} from "@/model";
import { OverpassQueryBuilderImp } from "./builder";
import { OverpassCompileUtils } from "./compile";
import { OverpassItemEvaluatorBuilderImp } from "./evaluator";
import { OverpassFilterBuilderImp } from "./filter";
import { OverpassStateImp } from "./state";
import { OverpassStatusValidatorImp } from "./status";
import { OverpassQueryValidatorImp } from "./validator";

export class OverpassApiObjectImp implements OverpassApiObject {
	public static readonly MAIN_INSTANCE = new URL("https://overpass-api.de/api/interpreter");

	constructor(
		private readonly adapter: RequestAdapter,
		private readonly interpreterUrl: URL,
		private readonly statusUrl: URL,
		private readonly queryValidator: OverpassQueryValidator,
		private readonly statusValidator: OverpassStatusValidator,
		private readonly compileUtils: CompileUtils,
		private readonly filterBuilder: OverpassFilterBuilder,
		private readonly queryBuilder: OverpassQueryBuilder,
		private readonly evaluatorItemBuilder: OverpassItemEvaluatorBuilder,
	) {}

	public static Build(
		adapter: RequestAdapter,
		interpreterUrlInput?: string | URL,
		statusUrlInput?: string | URL,
	): OverpassApiObjectImp {
		const interpreterUrl = OverpassApiObjectImp.InterpreterUrlFrom(interpreterUrlInput);
		const statusUrl = OverpassApiObjectImp.StatusUrlFrom(interpreterUrl, statusUrlInput);

		const queryValidator = new OverpassQueryValidatorImp(interpreterUrl);
		const statusValidator = new OverpassStatusValidatorImp(statusUrl);
		const compileUtils = new OverpassCompileUtils();
		const builder = new OverpassQueryBuilderImp(compileUtils);
		const filterBuilder = OverpassFilterBuilderImp.Build();
		const evaluatorItemBuilder = new OverpassItemEvaluatorBuilderImp();

		return new OverpassApiObjectImp(
			adapter,
			interpreterUrl,
			statusUrl,
			queryValidator,
			statusValidator,
			compileUtils,
			filterBuilder,
			builder,
			evaluatorItemBuilder,
		);
	}

	public static InterpreterUrlFrom(interpreterUrlInput?: string | URL): URL {
		return typeof interpreterUrlInput == "string"
			? new URL(interpreterUrlInput)
			: interpreterUrlInput ?? OverpassApiObjectImp.MAIN_INSTANCE;
	}

	public static StatusUrlFrom(interpreterUrl: URL, statusUrl?: string | URL): URL {
		return typeof statusUrl == "string"
			? new URL(statusUrl)
			: statusUrl ?? OverpassApiObjectImp.StatusUrlFromInterpreterUrl(interpreterUrl);
	}

	public static StatusUrlFromInterpreterUrl(interpreterUrl: URL): URL {
		const statusUrl = new URL(interpreterUrl);
		const parts = statusUrl.pathname.split("/").filter((part) => part != "");
		if (parts.slice(-2).join("/") != "api/interpreter") {
			throw new Error(`You should provide a status url for non standard interpreter ${interpreterUrl}`);
		}
		statusUrl.pathname = [...parts.slice(0, -1), "status"].join("/");
		return statusUrl;
	}

	public get __adapter__() {
		return this.adapter;
	}

	private compileParts(
		statements: OverpassStatement[],
		options?: OverpassOutputOptions,
		settings?: OverpassSettings,
	): CompiledItem {
		if (statements.length == 0) {
			throw new Error(`You should provide at least 1 statement ... try node.byId(5431618355)`);
		}

		return this.queryBuilder.buildQuery({ ...settings }, { ...options }, statements);
	}

	public buildQuery(
		statementBuilder: (state: OverpassState) => OverpassStatement[] | OverpassStatement,
		options?: OverpassOutputOptions,
		settings?: OverpassSettings,
	): string {
		const state = OverpassStateImp.Build(this.compileUtils, this.filterBuilder, this.evaluatorItemBuilder);

		const statements = statementBuilder(state);

		const compiledQuery = this.compileParts(
			statements instanceof Array ? statements : [statements],
			options,
			settings,
		);

		return compiledQuery.compile([]);
	}

	private async doRequest(query: string): Promise<HttpResponse> {
		return await this.adapter.request(this.interpreterUrl, {
			method: HttpMethod.Post,
			body: `data=${encodeURIComponent(query)}`,
		});
	}

	public async exec<S extends OverpassSettings, O extends OverpassOutputOptions>(
		settings: S,
		statementBuilder: (state: OverpassState) => OverpassStatement[] | OverpassStatement,
		options?: O | undefined,
	): Promise<OverpassApiOutput<S, O>> {
		const query = this.buildQuery(statementBuilder, { ...options }, settings);

		const httpResponse = await this.doRequest(query);

		return this.queryValidator.validate<S, O>(query, httpResponse, settings.format ?? OverpassFormat.XML);
	}

	public execJson<S extends OverpassSettingsNoFormat, O extends OverpassOutputOptions>(
		statementBuilder: (state: OverpassState) => OverpassStatement[] | OverpassStatement,
		options?: O | undefined,
		settings?: S | undefined,
	): Promise<OverpassApiOutput<OverpassJsonSettings<S>, O>> {
		return this.exec({ ...settings, format: OverpassFormat.JSON }, statementBuilder, options);
	}

	private getUnknownFormat({ contentType }: HttpResponse): OverpassFormat | undefined {
		switch (contentType) {
			case "application/json":
				return OverpassFormat.JSON;
			case "application/osm3s+xml":
				return OverpassFormat.XML;
			case "text/csv":
				return OverpassFormat.CSV;
			default:
				return undefined;
		}
	}

	public async execQuery(query: string): Promise<OverpassJsonOutput | string> {
		const httpResponse = await this.doRequest(query);

		const format = this.getUnknownFormat(httpResponse);

		return this.queryValidator.validate<OverpassSettings, OverpassOutputOptions>(query, httpResponse, format);
	}

	private static NormalizeOutput<S extends OverpassSettingsNoFormat, O extends OverpassOutputOptions>(
		output: OverpassStatement[] | OverpassStatement | CreateFunctionContext<S, O>,
		outpOptions: O | undefined,
		settings: S | undefined,
	): CreateFunctionContext<S, O> {
		if (output instanceof Array) {
			return { statements: output, outpOptions, settings };
		} else if ("statements" in output) {
			return output;
		} else {
			return { statements: [output], outpOptions, settings };
		}
	}

	public createFunction<
		Args extends AnyParamValue[],
		S extends OverpassSettingsNoFormat,
		O extends OverpassOutputOptions,
	>(
		argTypes: ArgTypes<Args>,
		statementBuilder: (
			state: OverpassState,
			...args: CreateFunctionArgs<Args>
		) => OverpassStatement[] | OverpassStatement,
		options?: O,
		settings?: S,
	): OverpassApiFunction<Args, S, O>;
	public createFunction<
		Args extends AnyParamValue[],
		S extends OverpassSettingsNoFormat,
		O extends OverpassOutputOptions,
	>(
		argTypes: ArgTypes<Args>,
		statementBuilder: (state: OverpassState, ...args: CreateFunctionArgs<Args>) => CreateFunctionContext<S, O>,
	): OverpassApiFunction<Args, S, O>;
	public createFunction<
		Args extends AnyParamValue[],
		S extends OverpassSettingsNoFormat,
		O extends OverpassOutputOptions,
	>(
		argTypes: ArgTypes<Args>,
		statementBuilder: (
			state: OverpassState,
			...args: CreateFunctionArgs<Args>
		) => OverpassStatement[] | OverpassStatement | CreateFunctionContext<S, O>,
		optionsInput?: O,
		settingsInput?: S,
	): OverpassApiFunction<Args, S, O> {
		const types = argTypes.map((type, index) => ({ index, type })) as CreateFunctionArgs<Args>;

		const state = OverpassStateImp.Build(this.compileUtils, this.filterBuilder, this.evaluatorItemBuilder);

		const builderOutput = statementBuilder(state, ...types);

		const { statements, outpOptions, settings } = OverpassApiObjectImp.NormalizeOutput(
			builderOutput,
			optionsInput,
			settingsInput,
		);

		const compiledQuery = this.compileParts(
			statements,
			{ ...outpOptions },
			{ ...settings, format: OverpassFormat.JSON },
		);

		return async (...args) => {
			const query = compiledQuery.compile(args);

			const httpResponse = await this.doRequest(query);

			return this.queryValidator.validate<S, O>(query, httpResponse, OverpassFormat.JSON);
		};
	}

	public async status(): Promise<OverpassStatus> {
		const result = await this.adapter.request(this.statusUrl);

		return this.statusValidator.validate(result);
	}
}
