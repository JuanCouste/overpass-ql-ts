import { Symetric } from "?/utils";
import { OverpassStringEvaluatorImp } from "@/imp";
import { expect, it } from "@jest/globals";
import { CompileEvaluatorSymetric } from "./utils";

export function compileStringEvaluatorsTests() {
	it("Should compile string evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(string) => OverpassStringEvaluatorImp.From(string),
			[Symetric.String("Hello")],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile wrapped string evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(string) => OverpassStringEvaluatorImp.From(OverpassStringEvaluatorImp.From(string)),
			[Symetric.String("Hello")],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});
}
