import { describe } from "@jest/globals";
import { compileAroundStatementTests } from "./around";
import { compileForEachStatementsTests } from "./forEach";
import { compileOutStatementTests } from "./options";
import { compileRecurseStatementTests } from "./recurse";
import { compileRootRecurseStatementTests } from "./rootRecurse";
import { compileSettingsStatementsTests } from "./settings";
import { compileSimpleStatementsTests } from "./simple";
import { compileTargetStatementTests } from "./target";

export function compileStatementsTests() {
	describe("Root Recurse", compileRootRecurseStatementTests);
	describe("Recurse", compileRecurseStatementTests);
	describe("Target", compileTargetStatementTests);
	describe("Around", compileAroundStatementTests);
	describe("Out", compileOutStatementTests);
	describe("Settings", compileSettingsStatementsTests);
	describe("Simple", compileSimpleStatementsTests);
	describe("For Each", compileForEachStatementsTests);
}
