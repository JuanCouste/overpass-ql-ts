import { Symetric } from "?/utils";
import { OverpassBooleanEvaluatorImp, OverpassItemEvaluatorBuilderImp } from "@/imp";
import { expect, it } from "@jest/globals";
import { CompileEvaluatorSymetric } from "./utils";

export function compileEvaluatorsMiscTests() {
	it("Should compile equals evaluator", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(boolean) => OverpassBooleanEvaluatorImp.From(true).eq(boolean),
			[Symetric.Bool(true)],
		);

		expect(withParams()).toEqual(raw());
	});

	it("Should compile not equals evaluator", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(boolean) => OverpassBooleanEvaluatorImp.From(true).neq(boolean),
			[Symetric.Bool(true)],
		);

		expect(withParams()).toEqual(raw());
	});

	it("Should compile element has tag evaluator", () => {
		const item = new OverpassItemEvaluatorBuilderImp();

		const [raw, withParams] = CompileEvaluatorSymetric((tag) => item.hasTag(tag), [Symetric.String("tag")]);

		expect(withParams()).toEqual(raw());
	});

	it("Should compile element get tag evaluator", () => {
		const item = new OverpassItemEvaluatorBuilderImp();

		const [raw, withParams] = CompileEvaluatorSymetric((tag) => item.getTag(tag), [Symetric.String("tag")]);

		expect(withParams()).toEqual(raw());
	});
}
