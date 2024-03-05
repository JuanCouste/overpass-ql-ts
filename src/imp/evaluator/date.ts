import {
	CompileUtils,
	CompiledItem,
	OverpassDateEvaluator,
	OverpassEvaluator,
	OverpassEvaluatorNode,
	OverpassExpression,
} from "@/model";
import { OverpassEvaluatorNodeImp } from "./evaluator";
import { OverpassMagnitudeEvaluatorImp } from "./mangnitude";

export class OverpassDateEvaluatorNode extends OverpassEvaluatorNodeImp<Date> {
	constructor(private readonly expression: OverpassExpression<Date>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.template`date(${u.date(this.expression)})`;
	}
}

export class OverpassDateEvaluatorImp extends OverpassMagnitudeEvaluatorImp<Date> implements OverpassDateEvaluator {
	protected evaluatorFromRawExp(expression: OverpassExpression<Date>): OverpassEvaluator<Date> {
		return new OverpassDateEvaluatorImp(new OverpassDateEvaluatorNode(expression));
	}

	static From(value: OverpassExpression<Date>): OverpassDateEvaluator {
		return new OverpassDateEvaluatorImp(new OverpassDateEvaluatorNode(value));
	}

	with(node: OverpassEvaluatorNode<Date>): OverpassEvaluator<Date> {
		return new OverpassDateEvaluatorImp(node);
	}
}
