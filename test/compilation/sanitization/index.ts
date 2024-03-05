import { describe } from "@jest/globals";
import { sanitizationBooleanTests } from "./boolean";
import { sanitizationBoundingBoxTests } from "./boundingbox";
import { sanitizationDateTests } from "./date";
import { sanitizationEnumTests } from "./enums";
import { sanitizationGeoPosTests } from "./geopos";
import { sanitizationNumberTests } from "./numbers";
import { sanitizationRegExpTests } from "./regexp";
import { sanitizationStringTests } from "./string";

export function sanitizationCompileTests() {
	describe("Numbers", sanitizationNumberTests);
	describe("Strings", sanitizationStringTests);
	describe("RegExp", sanitizationRegExpTests);
	describe("Dates", sanitizationDateTests);
	describe("GeoPos", sanitizationGeoPosTests);
	describe("BoundingBox", sanitizationBoundingBoxTests);
	describe("Enums", sanitizationEnumTests);
	describe("Boolean", sanitizationBooleanTests);
}
