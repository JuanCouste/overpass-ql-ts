import { describe } from "@jest/globals";
import { compileBooleanEvaluatorsTests } from "./boolean";
import { compileEvaluatorsMiscTests } from "./evaluator";
import { compileMagnitudeEvaluatorsTests } from "./magnitude";
import { compileNumberEvaluatorsTests } from "./number";
import { compileStringEvaluatorsTests } from "./string";

export function compileEvaluatorsTests() {
	describe("String", compileStringEvaluatorsTests);
	describe("Misc", compileEvaluatorsMiscTests);
	describe("Boolean", compileBooleanEvaluatorsTests);
	describe("Number", compileNumberEvaluatorsTests);
	describe("Magnitude", compileMagnitudeEvaluatorsTests);
}
