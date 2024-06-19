import { Symetric } from "?/utils";
import { OverpassStringEvaluatorImp } from "@/imp";
import { expect, it } from "@jest/globals";
import { CompileEvaluatorSymetric } from "./utils";

export function compileStringEvaluatorsTests() {
	it("Should compile string evaluator", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(string) => OverpassStringEvaluatorImp.From(string),
			[Symetric.String("Hello")],
		);

		expect(withParams()).toEqual(raw());
	});

	it("Should compile wrapped string evaluator", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(string) => OverpassStringEvaluatorImp.From(OverpassStringEvaluatorImp.From(string)),
			[Symetric.String("Hello")],
		);

		expect(withParams()).toEqual(raw());
	});
}
