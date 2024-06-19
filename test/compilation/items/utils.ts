import { CompileSymetric } from "?/compilation/symetry";
import { SymetricArgsExpression, SymetricArgumentsObject } from "?/utils";
import { AnyParamValue, CompiledItem, OverpassParameterError } from "@/model";
import { expect } from "@jest/globals";

export async function ExpectCompileResolves<Args extends AnyParamValue[]>(
	buildItem: (...args: SymetricArgsExpression<Args>) => CompiledItem<any>,
	args: SymetricArgumentsObject<Args>,
) {
	const [raw, withParams] = CompileSymetric(buildItem, args);

	await expect(raw).resolves.toBeDefined();

	await expect(withParams).resolves.toEqual(await raw);
}

export async function ExpectCompileRejects<Args extends AnyParamValue[]>(
	buildItem: (...args: SymetricArgsExpression<Args>) => CompiledItem<any>,
	args: SymetricArgumentsObject<Args>,
) {
	const [raw, withParams] = CompileSymetric(buildItem, args);

	await Promise.all([
		expect(raw).rejects.toThrowError(OverpassParameterError),
		expect(withParams).rejects.toThrowError(OverpassParameterError),
	]);
}
