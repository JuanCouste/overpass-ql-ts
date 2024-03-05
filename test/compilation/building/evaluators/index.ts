import { Symetric } from "?/utils";
import { OverpassBooleanEvaluatorImp } from "@/imp";
import { describe, expect, it } from "@jest/globals";
import { compileBooleanEvaluatorsTests } from "./boolean";
import { compileNumberEvaluatorsTests } from "./number";
import { CompileEvaluatorSymetric } from "./utils";

export function compileEvaluatorsTests() {
	describe("Evaluator", () => {
		it("Should compile equals evaluator", async () => {
			const [raw, withParams] = CompileEvaluatorSymetric(
				(boolean) => OverpassBooleanEvaluatorImp.From(true).eq(boolean),
				[Symetric.Bool(true)],
			);
			await expect(withParams).resolves.toEqual(await raw);
		});

		it("Should compile not equals evaluator", async () => {
			const [raw, withParams] = CompileEvaluatorSymetric(
				(boolean) => OverpassBooleanEvaluatorImp.From(true).neq(boolean),
				[Symetric.Bool(true)],
			);
			await expect(withParams).resolves.toEqual(await raw);
		});
	});

	describe("Boolean", compileBooleanEvaluatorsTests);
	describe("Number", compileNumberEvaluatorsTests);
}
