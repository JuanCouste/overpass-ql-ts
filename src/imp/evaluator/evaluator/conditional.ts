import { CompileUtils, CompiledItem, OverpassEvaluator } from "@/model";
import { OverpassEvaluatorNodeImp } from "./node";

export class OverpassConditionalEvaluatorNode<T, E extends OverpassEvaluator<T>> extends OverpassEvaluatorNodeImp<T> {
	constructor(
		private readonly condition: OverpassEvaluator<boolean>,
		private readonly ifTrue: E,
		private readonly ifFalse: E,
	) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.template`(${this.condition.compile(u)} ? ${this.ifTrue.compile(u)} : ${this.ifFalse.compile(u)})`;
	}
}
