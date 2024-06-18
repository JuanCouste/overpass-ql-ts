import { describe } from "@jest/globals";
import { compileEvaluatorsTests } from "./evaluators";
import { compileFiltersTests } from "./filters";
import { compileStatementsTests } from "./statements";

export function symetryUtilsTests() {
	describe("Statements", compileStatementsTests);
	describe("Filter", compileFiltersTests);
	describe("Evaluator", compileEvaluatorsTests);
}
