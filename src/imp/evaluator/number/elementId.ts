import { OverpassEvaluatorNodeImp } from "@/imp/evaluator/evaluator";
import { CompileUtils, CompiledItem } from "@/model";

export class OverpassElementIdEvaluatorNode extends OverpassEvaluatorNodeImp<number> {
	compile(u: CompileUtils): CompiledItem {
		return u.raw("id()");
	}
}
