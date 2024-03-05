import { CompileSymetric } from "?/compilation/symetry";
import { Symetric, SymetricArgsExpression, SymetricArgumentsObject } from "?/utils";
import { OverpassBooleanEvaluatorImp, OverpassCompileUtils, OverpassStringEvaluatorImp } from "@/imp";
import { AnyParamValue, OverpassEvaluator } from "@/index";
import { expect, it } from "@jest/globals";

export function compileEvaluatorsTests() {
	it("Should compile boolean evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(boolean) => OverpassBooleanEvaluatorImp.From(boolean),
			[Symetric.Bool(true)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

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

	it("Should compile not evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(boolean) => OverpassBooleanEvaluatorImp.From(boolean).not(),
			[Symetric.Bool(true)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile or evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(boolean) => OverpassBooleanEvaluatorImp.From(true).or(boolean),
			[Symetric.Bool(true)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile and evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(boolean) => OverpassBooleanEvaluatorImp.From(true).and(boolean),
			[Symetric.Bool(true)],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile then else evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(th, el) =>
				OverpassBooleanEvaluatorImp.From(true)
					.then(OverpassStringEvaluatorImp.From(th))
					.else(OverpassStringEvaluatorImp.From(el)),
			[Symetric.String("then"), Symetric.String("else")],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile conditional evaluator", async () => {
		const [raw, withParams] = CompileEvaluatorSymetric(
			(th, el) =>
				OverpassBooleanEvaluatorImp.From(true).conditional(
					OverpassStringEvaluatorImp.From(th),
					OverpassStringEvaluatorImp.From(el),
				),
			[Symetric.String("then"), Symetric.String("else")],
		);
		await expect(withParams).resolves.toEqual(await raw);
	});
}

function CompileEvaluatorSymetric<Args extends AnyParamValue[]>(
	buildEvaluator: (...args: SymetricArgsExpression<Args>) => OverpassEvaluator<any>,
	args: SymetricArgumentsObject<Args>,
) {
	const utils = new OverpassCompileUtils();

	return CompileSymetric<Args>((...args) => buildEvaluator(...args).compile(utils), args);
}
