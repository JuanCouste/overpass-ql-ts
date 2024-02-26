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

async function DoSymetricTest<
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
	optionsBuilder: ((...args: SymetricArgsExpression<Args>) => O) | undefined,
	settingsBuilder: ((...args: SymetricArgsExpression<Args>) => S) | undefined,
	check: SymetricCheck<S, O>,
) {
	const objectArgs = symetricArgs.map(anySymetricArgToObject) as SymetricArgumentsObject<Args>;
	const types = objectArgs.map((arg) => arg.type) as ArgTypes<Args>;
	const args = objectArgs.map((arg) => arg.exp) as Args;

	const api = apiBuilder();

	await Promise.all<void>(
		[
			async () =>
				api.execJson(
					(s) => statementBuilder(s, ...args),
					optionsBuilder?.(...args),
					settingsBuilder?.(...args),
				),
			async () =>
				api.createFunction(types, (state, ...args) => {
					const stm = statementBuilder(state, ...args);
					return {
						statements: stm instanceof Array ? stm : [stm],
						outpOptions: optionsBuilder?.(...args),
						settings: settingsBuilder?.(...args),
					};
				})(...args),
		].map((funct) => check(funct())),
	);
}

export type ItSymetricallyFunction = <Args extends AnyParamValue[]>(
	testName: string,
	apiBuilder: () => OverpassApiObject,
	statementBuilder: (
		state: OverpassState,
		...args: SymetricArgsExpression<Args>
	) => OverpassStatement[] | OverpassStatement,
	symetricArgs: AnySymetricArguments<Args>,
	check: SymetricCheck<OverpassSettingsNoFormat, OverpassOutputOptions>,
) => void;

function makeItSymetrically(itFunction: (testName: string, test: () => Promise<void>) => void): ItSymetricallyFunction {
	return <Args extends AnyParamValue[]>(
		testName: string,
		apiBuilder: () => OverpassApiObject,
		statementBuilder: (
			state: OverpassState,
			...args: SymetricArgsExpression<Args>
		) => OverpassStatement[] | OverpassStatement,
		symetricArgs: AnySymetricArguments<Args>,
		check: SymetricCheck<OverpassSettingsNoFormat, OverpassOutputOptions>,
	) => {
		itFunction(
			testName,
			async () => await DoSymetricTest(apiBuilder, statementBuilder, symetricArgs, undefined, undefined, check),
		);
	};
}

export const ItSymetrically = makeItSymetrically(it) as {
	only: ItSymetricallyFunction;
	skip: ItSymetricallyFunction;
} & ItSymetricallyFunction;

ItSymetrically.only = makeItSymetrically(it.only);
ItSymetrically.skip = makeItSymetrically(it.skip);

export type ItSymetricallyWOptsFunction = <
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
	optionsBuilder: ((...args: SymetricArgsExpression<Args>) => O) | undefined,
	settingsBuilder: ((...args: SymetricArgsExpression<Args>) => S) | undefined,
	symetricArgs: AnySymetricArguments<Args>,
	check: SymetricCheck<S, O>,
) => void;

function makeItSymetricallyWOpts(
	itFunction: (testName: string, test: () => Promise<void>) => void,
): ItSymetricallyWOptsFunction {
	return <Args extends AnyParamValue[], S extends OverpassSettingsNoFormat, O extends OverpassOutputOptions>(
		testName: string,
		apiBuilder: () => OverpassApiObject,
		statementBld: (
			state: OverpassState,
			...args: SymetricArgsExpression<Args>
		) => OverpassStatement[] | OverpassStatement,
		optionsBld: ((...args: SymetricArgsExpression<Args>) => O) | undefined,
		settingsBld: ((...args: SymetricArgsExpression<Args>) => S) | undefined,
		symetricArgs: AnySymetricArguments<Args>,
		check: SymetricCheck<S, O>,
	) => {
		itFunction(
			testName,
			async () => await DoSymetricTest(apiBuilder, statementBld, symetricArgs, optionsBld, settingsBld, check),
		);
	};
}

export const ItSymetricallyWOpts = makeItSymetricallyWOpts(it) as {
	only: ItSymetricallyWOptsFunction;
	skip: ItSymetricallyWOptsFunction;
} & ItSymetricallyWOptsFunction;

ItSymetricallyWOpts.only = makeItSymetricallyWOpts(it.only);
ItSymetricallyWOpts.skip = makeItSymetricallyWOpts(it.skip);
