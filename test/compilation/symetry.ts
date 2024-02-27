import { SymetricArgsExpression, SymetricArgumentsObject } from "?/utils";
import { AnyParamValue, CompiledItem, CreateFunctionArgs } from "@/index";

export function CompileSymetric<Args extends AnyParamValue[]>(
	buildItem: (...args: SymetricArgsExpression<Args>) => CompiledItem,
	args: SymetricArgumentsObject<Args>,
): [Promise<string>, Promise<string>] {
	const rawValues = args.map((arg) => arg.exp) as Args;
	const params = args.map((arg, index) => ({ index, type: arg.type })) as CreateFunctionArgs<Args>;

	return [Compile(buildItem, rawValues, rawValues), Compile(buildItem, params, rawValues)];
}

async function Compile<Args extends AnyParamValue[]>(
	buildItem: (...args: SymetricArgsExpression<Args>) => CompiledItem,
	actualArgs: SymetricArgsExpression<Args>,
	rawValues: Args,
): Promise<string> {
	return buildItem(...actualArgs).compile(rawValues);
}
