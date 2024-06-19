import { CompileSymetric } from "?/compilation/symetry";
import { SymetricArgsExpression, SymetricArgumentsObject } from "?/utils";
import { AnyParamValue, CompiledItem, OverpassParameterError } from "@/model";
import { expect } from "@jest/globals";

export function ExpectCompileResolves<Args extends AnyParamValue[]>(
	buildItem: (...args: SymetricArgsExpression<Args>) => CompiledItem<any>,
	args: SymetricArgumentsObject<Args>,
) {
	const [raw, withParams] = CompileSymetric(buildItem, args);

	const rawResult = raw();

	expect(rawResult).toBeDefined();

	expect(withParams()).toEqual(rawResult);
}

export function ExpectCompileRejects<Args extends AnyParamValue[]>(
	buildItem: (...args: SymetricArgsExpression<Args>) => CompiledItem<any>,
	args: SymetricArgumentsObject<Args>,
) {
	const [raw, withParams] = CompileSymetric(buildItem, args);

	expect(raw).toThrowError(OverpassParameterError);
	expect(withParams).toThrowError(OverpassParameterError);
}
