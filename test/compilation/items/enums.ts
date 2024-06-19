import { Symetric } from "?/utils";
import { EnumParamCompiledItem } from "@/imp";
import {
	ActualEnumParamType,
	EnumParamType,
	OverpassEnum,
	OverpassExpression,
	OverpassOutputGeoInfo,
	OverpassOutputVerbosity,
	OverpassQueryTarget,
	OverpassRecurseStmType,
	OverpassSortOrder,
	ParamType,
} from "@/index";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

const ENUMS: { [K in EnumParamType]: any } = {
	[ParamType.Target]: OverpassQueryTarget,
	[ParamType.Verbosity]: OverpassOutputVerbosity,
	[ParamType.GeoInfo]: OverpassOutputGeoInfo,
	[ParamType.SortOrder]: OverpassSortOrder,
	[ParamType.RecurseStm]: OverpassRecurseStmType,
};

export function parametersEnumTests() {
	Object.entries(ENUMS).forEach(([enumStr, enumObj]) => enumTests(enumStr, enumObj));
}

function enumTests<E extends OverpassEnum>(enumStr: string, enumObj: any) {
	const values = Object.values(enumObj).filter<number>((n): n is number => typeof n == "number")!;
	const paramType = +enumStr as ActualEnumParamType<E>;

	const BuildEnum = (value: OverpassExpression<E>) => new EnumParamCompiledItem<E>(paramType, value);
	const BuildParmm = (value: number) => Symetric.Enum<E>(paramType, value as E);

	it(`Should be fine when ${enumStr} is fine`, () => ExpectCompileResolves(BuildEnum, [BuildParmm(values[0])]));

	it(`Should error when ${enumStr} is invalid`, () => {
		for (const invalid of [NaN, Infinity, null!, undefined!]) {
			ExpectCompileRejects<[E]>(BuildEnum, [BuildParmm(invalid)]);
		}
	});

	it(`Should error when ${enumStr} is out of range`, () => {
		for (const outOfRange of [-1, Math.max(...values) + 1]) {
			ExpectCompileRejects<[E]>(BuildEnum, [BuildParmm(outOfRange)]);
		}
	});

	it(`Should error when parameter is not a ${enumStr}`, () =>
		ExpectCompileRejects(BuildEnum, [BuildParmm("1" as unknown as number)]));
}
