import { Symetric } from "?/utils";
import { OverpassNumberEvaluatorImp } from "@/imp";
import { OverpasComparissonOperator } from "@/model";
import { expect, it } from "@jest/globals";
import { CompileEvaluatorSymetric } from "./utils";

export function compileMagnitudeEvaluatorsTests() {
	it("Should compile number lower than", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(1).lt(number),
			[Symetric.Number(2)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile number lower or equals", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(1).le(number),
			[Symetric.Number(2)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile number greater or equals", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(1).ge(number),
			[Symetric.Number(2)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile number greater than", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(1).gt(number),
			[Symetric.Number(2)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile number comparisson", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(1).compare(OverpasComparissonOperator.Greater, number),
			[Symetric.Number(2)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});
}
