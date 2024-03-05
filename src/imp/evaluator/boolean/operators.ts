import { OverpassEvaluatorNodeImp } from "@/imp/evaluator/evaluator";
import { CompileUtils, CompiledItem, OverpassEvaluator } from "@/model";

export class OverpassOperatorEvaluatorNode extends OverpassEvaluatorNodeImp<boolean> {
	constructor(
		private readonly operator: "||" | "&&",
		private readonly conditions: OverpassEvaluator<boolean>[],
	) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		const conditions = this.conditions.map((condition) => condition.compile(u));
		return u.template`(${u.join(conditions, this.operator)})`;
	}
}
