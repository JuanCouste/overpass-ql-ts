import { describe } from "@jest/globals";
import { sanitizationBoundingBoxTests } from "./boundingbox";
import { sanitizationDateTests } from "./date";
import { sanitizationGeoPosTests } from "./geopos";
import { sanitizationNumberTests } from "./numbers";
import { sanitizationRegExpTests } from "./regexp";
import { sanitizationStringTests } from "./string";
import { sanitizationTargetTests } from "./target";

export function sanitizationCompileTests() {
	describe("Numbers", sanitizationNumberTests);
	describe("Strings", sanitizationStringTests);
	describe("RegExp", sanitizationRegExpTests);
	describe("Dates", sanitizationDateTests);
	describe("GeoPos", sanitizationGeoPosTests);
	describe("BoundingBox", sanitizationBoundingBoxTests);
	describe("Target", sanitizationTargetTests);
}
