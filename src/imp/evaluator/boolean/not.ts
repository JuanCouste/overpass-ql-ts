import { OverpassEvaluatorNodeImp } from "@/imp/evaluator/evaluator";
import { CompileUtils, CompiledItem, OverpassBooleanEvaluator } from "@/model";

export class OverpassNotEvaluatorNode extends OverpassEvaluatorNodeImp<boolean> {
	constructor(private readonly self: OverpassBooleanEvaluator) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.template`!${this.self.compile(u)}`;
	}
}
