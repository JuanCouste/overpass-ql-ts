import { OverpassEvaluatorNodeImp } from "@/imp/evaluator/evaluator";
import { OverpassMagnitudeEvaluatorImp } from "@/imp/evaluator/magnitude";
import {
	CompileUtils,
	CompiledItem,
	OverpassArithmeticOperator,
	OverpassEvaluator,
	OverpassEvaluatorExpression,
	OverpassEvaluatorNode,
	OverpassExpression,
	OverpassNumberEvaluator,
} from "@/model";
import { OverpassAbsEvaluatorNode } from "./abs";
import { OverpassArithmeticEvaluatorNode } from "./arithmetic";

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
		return new OverpassNumberEvaluatorImp(new OverpassAbsEvaluatorNode(this));
	}

	op(op: OverpassArithmeticOperator, rightExp: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator {
		const right = this.evaluatorFromExp(rightExp);
		return new OverpassNumberEvaluatorImp(new OverpassArithmeticEvaluatorNode(this, op, right));
	}

	plus(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator {
		return this.op(OverpassArithmeticOperator.Add, number);
	}

	minus(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator {
		return this.op(OverpassArithmeticOperator.Sub, number);
	}

	times(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator {
		return this.op(OverpassArithmeticOperator.Mult, number);
	}

	dividedBy(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator {
		return this.op(OverpassArithmeticOperator.Divide, number);
	}
}
