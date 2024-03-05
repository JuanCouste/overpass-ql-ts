import { OverpassEvaluatorNodeImp } from "@/imp/evaluator/evaluator";
import { OverpassMagnitudeEvaluatorImp } from "@/imp/evaluator/mangnitude";
import {
	CompileUtils,
	CompiledItem,
	OverpassEvaluator,
	OverpassEvaluatorExpression,
	OverpassEvaluatorNode,
	OverpassExpression,
	OverpassNumberEvaluator,
} from "@/model";

export class OverpassNumberEvaluatorNode extends OverpassEvaluatorNodeImp<number> {
	constructor(private readonly expression: OverpassExpression<number>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.number(this.expression);
	}
}

export class OverpassNumberEvaluatorImp
	extends OverpassMagnitudeEvaluatorImp<number>
	implements OverpassNumberEvaluator
{
	static From(value: OverpassExpression<number>): OverpassNumberEvaluator {
		return new OverpassNumberEvaluatorImp(new OverpassNumberEvaluatorNode(value));
	}

	protected evaluatorFromRawExp(expression: OverpassExpression<number>): OverpassEvaluator<number> {
		return new OverpassNumberEvaluatorImp(new OverpassNumberEvaluatorNode(expression));
	}

	with(node: OverpassEvaluatorNode<number>): OverpassEvaluator<number> {
		return new OverpassNumberEvaluatorImp(node);
	}

	abs(): OverpassNumberEvaluator {
		throw new Error("Method not implemented.");
	}
	plus(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator {
		throw new Error("Method not implemented.");
	}
	minus(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator {
		throw new Error("Method not implemented.");
	}
	times(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator {
		throw new Error("Method not implemented.");
	}
	dividedBy(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator {
		throw new Error("Method not implemented.");
	}
}
