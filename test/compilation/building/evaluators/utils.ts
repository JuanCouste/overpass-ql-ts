import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { CompileSymetric } from "?/compilation/symetry";
import { SymetricArgsExpression, SymetricArgumentsObject } from "?/utils";
import { OverpassCompileUtils } from "@/imp";
import { AnyParamValue, OverpassEvaluator } from "@/index";

export function CompileEvaluatorSymetric<Args extends AnyParamValue[]>(
	buildEvaluator: (...args: SymetricArgsExpression<Args>) => OverpassEvaluator<any>,
	args: SymetricArgumentsObject<Args>,
) {
	const utils = new OverpassCompileUtils(NO_SANITIZER);

	return CompileSymetric<Args>((...args) => buildEvaluator(...args).compile(utils), args);
}
