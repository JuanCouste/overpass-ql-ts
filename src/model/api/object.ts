import { ActualParamType, AnyParamValue, ParamItem } from "@/model/expression";
import { CompileFunction, OverpassStatement } from "@/model/parts";
import { OverpassFormat, OverpassOutputOptions, OverpassSettings } from "@/model/query";
import { OverpassApiOutput, OverpassJsonOutput } from "./output";
import { OverpassState } from "./state";
import { OverpassStatus } from "./status";

export type OverpassJsonSettings<S extends OverpassSettingsNoFormat> = S & { format: OverpassFormat.JSON };

export type OverpassSettingsNoFormat = Omit<OverpassSettings, "format">;

export type ArgTypes<Args extends AnyParamValue[]> = { [K in keyof Args]: ActualParamType<Args[K]> };

export type CreateFunctionArgs<Args extends AnyParamValue[]> = { [K in keyof Args]: ParamItem<Args[K]> };

export interface CreateFunctionContext<S extends OverpassSettingsNoFormat, O extends OverpassOutputOptions> {
	readonly statements: OverpassStatement[];
	readonly outpOptions?: O;
	readonly settings?: S;
}

export type OverpassApiFunction<
	Args extends AnyParamValue[],
	S extends OverpassSettingsNoFormat,
	O extends OverpassOutputOptions,
> = (...args: Args) => Promise<OverpassApiOutput<OverpassJsonSettings<S>, O>>;

export interface OverpassApiObject {
	/** Build a query string from a list of statements */
	buildQuery(
		statementBuilder: (state: OverpassState) => OverpassStatement[] | OverpassStatement,
		options?: OverpassOutputOptions,
		settings?: OverpassSettings,
	): string;

	/** Execute a query with custom output format  */
	exec<S extends OverpassSettings, O extends OverpassOutputOptions>(
		settings: S,
		statementBuilder: (state: OverpassState) => OverpassStatement[] | OverpassStatement,
		options?: O,
	): Promise<OverpassApiOutput<S, O>>;

	/** Execute a query with json output format */
	execJson<S extends OverpassSettingsNoFormat, O extends OverpassOutputOptions>(
		statementBuilder: (state: OverpassState) => OverpassStatement[] | OverpassStatement,
		options?: O,
		settings?: S,
	): Promise<OverpassApiOutput<OverpassJsonSettings<S>, O>>;

	/** Executes a raw string query */
	execQuery(query: string | CompileFunction): Promise<OverpassJsonOutput | string>;

	/**
	 * Creates a precompiled query that has some arguments
	 * Settings & Options are static
	 */
	createFunction<Args extends AnyParamValue[], S extends OverpassSettingsNoFormat, O extends OverpassOutputOptions>(
		argTypes: ArgTypes<Args>,
		statementBuilder: (
			state: OverpassState,
			...args: CreateFunctionArgs<Args>
		) => OverpassStatement[] | OverpassStatement,
		options?: O,
		settings?: S,
	): OverpassApiFunction<Args, S, O>;

	/**
	 * Creates a precompiled query that has some arguments
	 * Settings & Options are dynamic
	 */
	createFunction<Args extends AnyParamValue[], S extends OverpassSettingsNoFormat, O extends OverpassOutputOptions>(
		argTypes: ArgTypes<Args>,
		statementBuilder: (state: OverpassState, ...args: CreateFunctionArgs<Args>) => CreateFunctionContext<S, O>,
	): OverpassApiFunction<Args, S, O>;

	/** Fetches the overpass api instance status */
	status(): Promise<OverpassStatus>;
}
