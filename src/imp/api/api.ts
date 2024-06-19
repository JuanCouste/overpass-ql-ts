import { OverpassOutStatement, OverpassSettingsStatement } from "@/imp/statement";
import { HttpMethod, HttpResponse, OverpassQueryValidator, OverpassStatusValidator, RequestAdapter } from "@/imp/types";
import {
	AnyParamValue,
	ArgTypes,
	CompileFunction,
	CompileUtils,
	CompiledItem,
	CreateFunctionArgs,
	CreateFunctionContext,
	OverpassApiFunction,
	OverpassApiObject,
	OverpassApiOutput,
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
	OverpassTagFilterBuilder,
	ParamItem,
} from "@/model";
import { OverpassStateImp } from "./state";

export class OverpassApiObjectImp implements OverpassApiObject {
	public static readonly MAIN_INSTANCE = new URL("https://overpass-api.de/api/interpreter");

	constructor(
		private readonly adapter: RequestAdapter,
		private readonly interpreterUrl: URL,
		private readonly statusUrl: URL,
		private readonly queryValidator: OverpassQueryValidator,
		private readonly statusValidator: OverpassStatusValidator,
		private readonly compileUtils: CompileUtils,
		private readonly tagBuilder: OverpassTagFilterBuilder,
		private readonly evaluatorItemBuilder: OverpassItemEvaluatorBuilder,
	) {}

	static BuildDeprecated: (
		adapter: RequestAdapter,
		interpreterUrlInput?: string | URL,
		statusUrlInput?: string | URL,
	) => OverpassApiObjectImp;

	static InterpreterUrlFromDeprecated: (interpreterUrlInput?: string | URL) => URL;

	static StatusUrlFromDeprecated: (interpreterUrl: URL, statusUrl?: string | URL) => URL;

	static StatusUrlFromInterpreterUrlDeprecated: (interpreterUrl: URL) => URL;

	/** @deprecated since 1.8.1, will be removed on 2.x.x, use root function {@link BuildOverpassApi} */
	public static Build(
		adapter: RequestAdapter,
		interpreterUrlInput?: string | URL,
		statusUrlInput?: string | URL,
	): OverpassApiObjectImp {
		console.warn("Method OverpassApiObjectImp.Build has been deprecated since 1.8.1");
		console.warn("Will be removed on 2.x.x, use root function BuildOverpassApi");
		return OverpassApiObjectImp.BuildDeprecated(adapter, interpreterUrlInput, statusUrlInput);
	}

	/** @deprecated since 1.8.1, will be removed on 2.x.x, use root function {@link InterpreterUrlFrom} */
	public static InterpreterUrlFrom(interpreterUrlInput?: string | URL): URL {
		console.warn("Method OverpassApiObjectImp.InterpreterUrlFrom has been deprecated since 1.8.1");
		console.warn("Will be removed on 2.x.x, use root function InterpreterUrlFrom");
		return OverpassApiObjectImp.InterpreterUrlFromDeprecated(interpreterUrlInput);
	}

	/** @deprecated since 1.8.1, will be removed on 2.x.x, use root function {@link StatusUrlFrom} */
	public static StatusUrlFrom(interpreterUrl: URL, statusUrl?: string | URL): URL {
		console.warn("Method OverpassApiObjectImp.StatusUrlFrom has been deprecated since 1.8.1");
		console.warn("Will be removed on 2.x.x, use root function StatusUrlFrom");
		return OverpassApiObjectImp.StatusUrlFromDeprecated(interpreterUrl, statusUrl);
	}

	/** @deprecated since 1.8.1, will be removed on 2.x.x, use root function {@link StatusUrlFromInterpreterUrl} */
	public static StatusUrlFromInterpreterUrl(interpreterUrl: URL): URL {
		console.warn("Method OverpassApiObjectImp.StatusUrlFromInterpreterUrl has been deprecated since 1.8.1");
		console.warn("Will be removed on 2.x.x, use root function StatusUrlFromInterpreterUrl");
		return OverpassApiObjectImp.StatusUrlFromInterpreterUrlDeprecated(interpreterUrl);
	}

	public get __adapter__() {
		return this.adapter;
	}

	private compileParts(
		statements: OverpassStatement[],
		options?: OverpassOutputOptions,
		settings?: OverpassSettings,
	): CompiledItem<string> {
		if (statements.length == 0) {
			throw new Error(`You should provide at least 1 statement ... try node.byId(5431618355)`);
		}

		const actualStatements = [...statements, new OverpassOutStatement({ ...options })];

		if (OverpassSettingsStatement.HasSettings(settings)) {
			actualStatements.unshift(OverpassSettingsStatement.BuildSettings(settings));
		}

		return this.compileUtils.join(
			actualStatements.map((stm) => this.compileUtils.template`${stm.compile(this.compileUtils)};`),
			"\n",
		);
	}

	public buildQuery(
		statementBuilder: (state: OverpassState) => OverpassStatement[] | OverpassStatement,
		options?: OverpassOutputOptions,
		settings?: OverpassSettings,
	): string {
		const state = OverpassStateImp.Build(this.compileUtils, this.tagBuilder, this.evaluatorItemBuilder);

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

	public async execQuery(queryInput: string | CompileFunction): Promise<OverpassJsonOutput | string> {
		const query = typeof queryInput == "string" ? queryInput : queryInput(this.compileUtils).asString().simplify();

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
		const types = argTypes.map((type, i) => new ParamItem<any>(i, type)) as CreateFunctionArgs<Args>;

		const state = OverpassStateImp.Build(this.compileUtils, this.tagBuilder, this.evaluatorItemBuilder);

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
