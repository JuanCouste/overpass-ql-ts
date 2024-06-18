import { describe } from "@jest/globals";
import { parametersBooleanTests } from "./boolean";
import { parametersBoundingBoxTests } from "./boundingbox";
import { parametersDateTests } from "./date";
import { parametersEnumTests } from "./enums";
import { parametersGeoPosTests } from "./geopos";
import { parametersNumberTests } from "./numbers";
import { parametersRegExpTests } from "./regexp";
import { parametersSetTests } from "./set";
import { parametersStringTests } from "./string";

export function parametersCompileTests() {
	describe("Numbers", parametersNumberTests);
	describe("Strings", parametersStringTests);
	describe("Set", parametersSetTests);
	describe("RegExp", parametersRegExpTests);
	describe("Dates", parametersDateTests);
	describe("GeoPos", parametersGeoPosTests);
	describe("BoundingBox", parametersBoundingBoxTests);
	describe("Enums", parametersEnumTests);
	describe("Boolean", parametersBooleanTests);
}
