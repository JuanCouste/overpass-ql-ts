import { Symetric } from "?/utils";
import { OverpassBooleanEvaluatorImp, OverpassItemEvaluatorBuilderImp } from "@/imp";
import { expect, it } from "@jest/globals";
import { CompileEvaluatorSymetric } from "./utils";

export function compileEvaluatorsMiscTests() {
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

	it("Should compile element has tag evaluator", async () => {
		const item = new OverpassItemEvaluatorBuilderImp();

		const [raw, withParams] = CompileEvaluatorSymetric((tag) => item.hasTag(tag), [Symetric.String("tag")]);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile element get tag evaluator", async () => {
		const item = new OverpassItemEvaluatorBuilderImp();

		const [raw, withParams] = CompileEvaluatorSymetric((tag) => item.getTag(tag), [Symetric.String("tag")]);

		await expect(withParams).resolves.toEqual(await raw);
	});
}
