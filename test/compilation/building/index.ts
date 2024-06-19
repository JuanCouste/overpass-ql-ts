import { OverpassCompileUtils } from "@/imp";
import { describe, expect, it } from "@jest/globals";
import { NO_SANITIZER } from "../nosanitizer";
import { compileEvaluatorsTests } from "./evaluators";
import { compileFiltersTests } from "./filters";
import { compileStatementsTests } from "./statements";

export function symetryUtilsTests() {
	describe("Statements", compileStatementsTests);
	describe("Filters", compileFiltersTests);
	describe("Evaluator", compileEvaluatorsTests);

	it("Should compile templates strings", () => {
		const u = new OverpassCompileUtils(NO_SANITIZER);

		const template = u.template`1${u.raw("2")}3${u.raw("4")}`;

		expect(template.simplify()).toEqual("1234");
	});

	it("Should not allow null values on templates", () => {
		const u = new OverpassCompileUtils(NO_SANITIZER);

		expect(() => u.template`1${null!}3`).toThrowError(Error);
	});

	it("Should compile join strings", () => {
		const u = new OverpassCompileUtils(NO_SANITIZER);

		const join = u.join([u.raw('"'), u.raw('"')], "Test");

		expect(join.simplify()).toEqual('"Test"');
	});

	it("Should not allow null values on join", () => {
		const u = new OverpassCompileUtils(NO_SANITIZER);

		expect(() => u.join([null!, u.raw('"')], "-")).toThrowError(Error);
	});

	it("Should not allow null value as join", () => {
		const u = new OverpassCompileUtils(NO_SANITIZER);

		expect(() => u.join([u.raw('"'), u.raw('"')], null!)).toThrowError(Error);
	});
}
