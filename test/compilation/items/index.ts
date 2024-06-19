import { ParentCompiledItem, SetParamCompiledItem } from "@/imp";
import { ParamItem, ParamType } from "@/index";
import { describe, expect, it } from "@jest/globals";
import { parametersBooleanTests } from "./boolean";
import { parametersBoundingBoxTests } from "./boundingbox";
import { parametersDateTests } from "./date";
import { parametersEnumTests } from "./enums";
import { parametersGeoPosTests } from "./geopos";
import { parametersNumberTests } from "./numbers";
import { parametersRegExpTests } from "./regexp";
import { parametersSetTests } from "./set";
import { parametersStringTests } from "./string";
import { itemTransformTests } from "./transform";

export function compileItemTests() {
	describe("Parameters", () => {
		describe("Numbers", parametersNumberTests);
		describe("Strings", parametersStringTests);
		describe("Set", parametersSetTests);
		describe("RegExp", parametersRegExpTests);
		describe("Dates", parametersDateTests);
		describe("GeoPos", parametersGeoPosTests);
		describe("BoundingBox", parametersBoundingBoxTests);
		describe("Enums", parametersEnumTests);
		describe("Boolean", parametersBooleanTests);
	});

	describe("Transform", itemTransformTests);

	it("Should not allow items with params to be simplified", () => {
		const item = new ParentCompiledItem([new SetParamCompiledItem(new ParamItem<string>(0, ParamType.String))]);

		expect(() => item.simplify()).toThrowError(Error);
	});
}
