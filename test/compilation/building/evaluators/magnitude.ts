import { Symetric } from "?/utils";
import { OverpassNumberEvaluatorImp } from "@/imp";
import { OverpasComparissonOperator } from "@/model";
import { expect, it } from "@jest/globals";
import { CompileEvaluatorSymetric } from "./utils";

export function compileMagnitudeEvaluatorsTests() {
	it("Should compile number lower than", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(1).lt(number),
			[Symetric.Number(2)],
		);

		expect(withParams()).toEqual(raw());
	});

	it("Should compile number lower or equals", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(1).le(number),
			[Symetric.Number(2)],
		);

		expect(withParams()).toEqual(raw());
	});

	it("Should compile number greater or equals", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(1).ge(number),
			[Symetric.Number(2)],
		);

		expect(withParams()).toEqual(raw());
	});

	it("Should compile number greater than", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(1).gt(number),
			[Symetric.Number(2)],
		);

		expect(withParams()).toEqual(raw());
	});

	it("Should compile number comparisson", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(number) => OverpassNumberEvaluatorImp.From(1).compare(OverpasComparissonOperator.Greater, number),
			[Symetric.Number(2)],
		);

		expect(withParams()).toEqual(raw());
	});
}
