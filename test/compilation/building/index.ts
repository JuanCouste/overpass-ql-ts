import { describe } from "@jest/globals";
import { compileEvaluatorsTests } from "./evaluators";
import { compileFiltersTests } from "./filters";
import { compileSettingsTests } from "./settings";
import { compileStatementsTests } from "./statements";

export function symetryUtilsTests() {
	describe("Settings", compileSettingsTests);
	describe("Statements", compileStatementsTests);
	describe("Filter", compileFiltersTests);
	describe("Evaluator", compileEvaluatorsTests);
}
