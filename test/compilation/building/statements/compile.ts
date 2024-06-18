import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { CompileSymetric } from "?/compilation/symetry";
import { SymetricArgsExpression, SymetricArgumentsObject } from "?/utils";
import { OverpassCompileUtils } from "@/imp";
import { AnyParamValue, OverpassStatement } from "@/index";

export function CompileStatementsSymetric<Args extends AnyParamValue[]>(
	buildStatement: (...args: SymetricArgsExpression<Args>) => OverpassStatement,
	args: SymetricArgumentsObject<Args>,
) {
	const utils = new OverpassCompileUtils(NO_SANITIZER);

	return CompileSymetric<Args>((...args) => buildStatement(...args).compile(utils), args);
}
