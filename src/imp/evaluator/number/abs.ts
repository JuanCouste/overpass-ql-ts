import { OverpassEvaluatorNodeImp } from "@/imp/evaluator/evaluator";
import { CompileUtils, CompiledItem, OverpassEvaluator } from "@/model";

export class OverpassAbsEvaluatorNode extends OverpassEvaluatorNodeImp<number> {
	constructor(private readonly self: OverpassEvaluator<number>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.template`abs(${this.self.compile(u)})`;
	}
}
