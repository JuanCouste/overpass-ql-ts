import { Symetric } from "?/utils";
import { OverpassCompileUtils } from "@/imp";
import {
	CompileUtils,
	CompiledItem,
	EnumParamType,
	OverpassOutputGeoInfo,
	OverpassOutputVerbosity,
	OverpassQueryTarget,
	OverpassRecurseStmType,
	OverpassSortOrder,
	ParamType,
} from "@/index";
import { describe, it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

const ENUMS: { [K in EnumParamType]: [any, (u: CompileUtils, v: any) => CompiledItem] } = {
	[ParamType.Target]: [OverpassQueryTarget, (u, v: OverpassQueryTarget) => u.target(v)],
	[ParamType.Verbosity]: [OverpassOutputVerbosity, (u, v: OverpassOutputVerbosity) => u.verbosity(v)],
	[ParamType.GeoInfo]: [OverpassOutputGeoInfo, (u, v: OverpassOutputGeoInfo) => u.geoInfo(v)],
	[ParamType.SortOrder]: [OverpassSortOrder, (u, v: OverpassSortOrder) => u.sortOrder(v)],
	[ParamType.RecurseStm]: [OverpassRecurseStmType, (u, v: OverpassRecurseStmType) => u.recurse(v)],
};

export function sanitizationEnumTests() {
	Object.entries(ENUMS).forEach(([enumStr, [enumObj, compile]]) => {
		const paramType: EnumParamType = +enumStr;

		describe(`${ParamType[paramType]}`, () => {
			const numericValues = Object.values(enumObj).filter<number>((n): n is number => typeof n == "number")!;

			it(`Should be fine when ${ParamType[paramType]} is fine`, async () => {
				const utils = new OverpassCompileUtils();

				await ExpectCompileResolves(
					(value) => compile(utils, value),
					[Symetric.Enum(paramType, numericValues[0])],
				);
			});

			const max = Math.max(...numericValues);

			Array<number>(NaN, Infinity, null!, undefined!, -1, max + 1).forEach((number) => {
				it(`Should error when ${ParamType[paramType]} is ${number}`, async () => {
					const utils = new OverpassCompileUtils();

					await ExpectCompileRejects(
						(value) => compile(utils, value),
						[Symetric.Enum(ParamType.Target, number)],
					);
				});
			});

			it(`Should error when parameter is not a ${ParamType[paramType]}`, async () => {
				const utils = new OverpassCompileUtils();

				await ExpectCompileRejects(
					(value) => compile(utils, value),
					[Symetric.Enum(ParamType.Target, "1" as unknown as OverpassQueryTarget)],
				);
			});
		});
	});
}
