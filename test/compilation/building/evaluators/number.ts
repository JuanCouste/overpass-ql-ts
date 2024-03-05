import { Symetric } from "?/utils";
import { OverpassNumberEvaluatorImp } from "@/imp";
import { OverpassArithmeticOperator } from "@/model";
import { expect, it } from "@jest/globals";
import { CompileEvaluatorSymetric } from "./utils";

export function compileNumberEvaluatorsTests() {
	it("Should compile number evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(number),
			[Symetric.Number(1)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile abs evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(number).abs(),
			[Symetric.Number(-1)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile plus evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(number).plus(1),
			[Symetric.Number(2)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile sub evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(number).minus(1),
			[Symetric.Number(2)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile mult evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(number).times(1),
			[Symetric.Number(2)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile divide evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(number).dividedBy(1),
			[Symetric.Number(2)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile plus evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(1).plus(number),
			[Symetric.Number(2)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile sub evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(1).minus(number),
			[Symetric.Number(2)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile mult evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(1).times(number),
			[Symetric.Number(2)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile divide evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(1).dividedBy(number),
			[Symetric.Number(2)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile arithmetic operator evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(1).op(OverpassArithmeticOperator.Add, number),
			[Symetric.Number(2)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});
}
