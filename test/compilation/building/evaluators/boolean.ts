import { Symetric } from "?/utils";
import { OverpassBooleanEvaluatorImp, OverpassStringEvaluatorImp } from "@/imp";
import { expect, it } from "@jest/globals";
import { CompileEvaluatorSymetric } from "./utils";

export function compileBooleanEvaluatorsTests() {
	it("Should compile boolean evaluator", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(boolean) => OverpassBooleanEvaluatorImp.From(boolean),
			[Symetric.Bool(true)],
		);

		expect(withParams()).toEqual(raw());
	});

	it("Should compile wrapped boolean evaluator", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(boolean) => OverpassBooleanEvaluatorImp.From(OverpassBooleanEvaluatorImp.From(boolean)),
			[Symetric.Bool(true)],
		);

		expect(withParams()).toEqual(raw());
	});

	it("Should compile not evaluator", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(boolean) => OverpassBooleanEvaluatorImp.From(boolean).not(),
			[Symetric.Bool(true)],
		);

		expect(withParams()).toEqual(raw());
	});

	it("Should compile or evaluator", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(boolean) => OverpassBooleanEvaluatorImp.From(true).or(boolean),
			[Symetric.Bool(true)],
		);

		expect(withParams()).toEqual(raw());
	});

	it("Should compile and evaluator", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(boolean) => OverpassBooleanEvaluatorImp.From(true).and(boolean),
			[Symetric.Bool(true)],
		);

		expect(withParams()).toEqual(raw());
	});

	it("Should compile then else evaluator", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(th, el) =>
				OverpassBooleanEvaluatorImp.From(true)
					.then(OverpassStringEvaluatorImp.From(th))
					.else(OverpassStringEvaluatorImp.From(el)),
			[Symetric.String("then"), Symetric.String("else")],
		);

		expect(withParams()).toEqual(raw());
	});

	it("Should compile conditional evaluator", () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(th, el) =>
				OverpassBooleanEvaluatorImp.From(true).conditional(
					OverpassStringEvaluatorImp.From(th),
					OverpassStringEvaluatorImp.From(el),
				),
			[Symetric.String("then"), Symetric.String("else")],
		);

		expect(withParams()).toEqual(raw());
	});
}
