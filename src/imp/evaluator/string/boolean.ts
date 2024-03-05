import { OverpassEvaluatorNodeImp } from "@/imp/evaluator/evaluator";
import { CompileUtils, CompiledItem, OverpassEvaluator } from "@/model";

export class OverpassAsBooleanEvaluatorNode extends OverpassEvaluatorNodeImp<boolean> {
	constructor(private readonly self: OverpassEvaluator<string>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return this.self.compile(u);
	}
}
