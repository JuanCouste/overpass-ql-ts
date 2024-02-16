import {
	ActualParamType,
	AnyParamValue,
	OverpassBoundingBox,
	OverpassExpression,
	OverpassGeoPos,
	OverpassStatement,
} from "@/model";
import {
	ArgTypes,
	OverpassApiObject,
	OverpassApiOutput,
	OverpassJsonSettings,
	OverpassOutputOptions,
	OverpassSettingsNoFormat,
	OverpassState,
} from "@/query";
import { it } from "@jest/globals";

export type SymetricArgumentArray<T> = [OverpassExpression<T>, ActualParamType<T>];

export interface SymetricArgumentObject<T> {
	readonly exp: OverpassExpression<T>;
	readonly type: ActualParamType<T>;
}

export type AnySymetricArgument<T> = SymetricArgumentArray<T> | SymetricArgumentObject<T>;

export type AnyNonMixableValue = number | string | RegExp | OverpassBoundingBox | OverpassGeoPos;

export type AnySymetricArguments<Args extends AnyParamValue[]> = {
	[K in keyof Args]: AnySymetricArgument<Args[K]>;
};

export type SymetricArgsExpression<Args extends AnyParamValue[]> = { [K in keyof Args]: OverpassExpression<Args[K]> };

function anySymetricArgToObject<T>(arg: AnySymetricArgument<T>): SymetricArgumentObject<T> {
	return arg instanceof Array ? { exp: arg[0], type: arg[1] } : arg;
}

type SymetricArgumentsObject<Args extends AnyParamValue[]> = { [K in keyof Args]: SymetricArgumentObject<Args[K]> };

export type SymetricCheck<S extends OverpassSettingsNoFormat, O extends OverpassOutputOptions> = (
	promise: Promise<OverpassApiOutput<OverpassJsonSettings<S>, O>>,
) => Promise<void>;

export async function DoSymetricTest<
	Args extends AnyParamValue[],
	S extends OverpassSettingsNoFormat,
	O extends OverpassOutputOptions,
>(
	apiBuilder: () => OverpassApiObject,
	statementBuilder: (
		state: OverpassState,
		...args: SymetricArgsExpression<Args>
	) => OverpassStatement[] | OverpassStatement,
	symetricArgs: AnySymetricArguments<Args>,
	options: O | undefined,
	settings: S | undefined,
	check: SymetricCheck<S, O>,
) {
	const objectArgs = symetricArgs.map(anySymetricArgToObject) as SymetricArgumentsObject<Args>;
	const types = objectArgs.map((arg) => arg.type) as ArgTypes<Args>;
	const args = objectArgs.map((arg) => arg.exp) as Args;

	const api = apiBuilder();

	await Promise.all<void>(
		[
			async () => api.execJson((s) => statementBuilder(s, ...args), options, settings),
			async () => api.createFunction(types, statementBuilder, options, settings)(...args),
		].map((funct) => check(funct())),
	);
}

export function DoSymetricPlainTest<
	Args extends AnyParamValue[],
	S extends OverpassSettingsNoFormat,
	O extends OverpassOutputOptions,
>(
	apiBuilder: () => OverpassApiObject,
	statementBuilder: (
		state: OverpassState,
		...args: SymetricArgsExpression<Args>
	) => OverpassStatement[] | OverpassStatement,
	symetricArgs: AnySymetricArguments<Args>,
	check: SymetricCheck<S, O>,
) {
	return DoSymetricTest(apiBuilder, statementBuilder, symetricArgs, undefined, undefined, check);
}

export function ItSymetrically<
	Args extends AnyParamValue[],
	S extends OverpassSettingsNoFormat,
	O extends OverpassOutputOptions,
>(
	testName: string,
	apiBuilder: () => OverpassApiObject,
	statementBuilder: (
		state: OverpassState,
		...args: SymetricArgsExpression<Args>
	) => OverpassStatement[] | OverpassStatement,
	symetricArgs: AnySymetricArguments<Args>,
	check: SymetricCheck<S, O>,
) {
	it(
		testName,
		async () => await DoSymetricTest(apiBuilder, statementBuilder, symetricArgs, undefined, undefined, check),
	);
}

ItSymetrically.only = function ItSymetrically<
	Args extends AnyParamValue[],
	S extends OverpassSettingsNoFormat,
	O extends OverpassOutputOptions,
>(
	testName: string,
	apiBuilder: () => OverpassApiObject,
	statementBuilder: (
		state: OverpassState,
		...args: SymetricArgsExpression<Args>
	) => OverpassStatement[] | OverpassStatement,
	symetricArgs: AnySymetricArguments<Args>,
	check: SymetricCheck<S, O>,
) {
	it.only(
		testName,
		async () => await DoSymetricTest(apiBuilder, statementBuilder, symetricArgs, undefined, undefined, check),
	);
};
