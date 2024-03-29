import { describe } from "@jest/globals";
import { compileFiltersTests } from "./filters";
import { compileOptionsTests } from "./options";
import { compileSettingsTests } from "./settings";
import { compileStatementsTests } from "./statements";

export function symetryUtilsTests() {
	describe("Settings", compileSettingsTests);
	describe("Options", compileOptionsTests);
	describe("Statements", compileStatementsTests);
	describe("Filter", compileFiltersTests);
}
