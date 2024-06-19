import { SymetricArgsExpression, SymetricArgumentsObject } from "?/utils";
import { AnyParamValue, CompiledItem, CreateFunctionArgs, ParamItem } from "@/index";

export function CompileSymetric<Args extends AnyParamValue[]>(
	buildItem: (...args: SymetricArgsExpression<Args>) => CompiledItem<any>,
	args: SymetricArgumentsObject<Args>,
): [() => string, () => string] {
	const rawValues = args.map((arg) => arg.exp) as Args;
	const params = args.map((arg, index) => new ParamItem<any>(index, arg.type)) as CreateFunctionArgs<Args>;

	return [() => buildItem(...rawValues).compile(rawValues), () => buildItem(...params).compile(rawValues)];
}
