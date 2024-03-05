import {
	OverpassConditionalEvaluatorNode,
	OverpassEvaluatorImp,
	OverpassEvaluatorNodeImp,
} from "@/imp/evaluator/evaluator";
import {
	CompileUtils,
	CompiledItem,
	OverpassBooleanEvaluator,
	OverpassBooleanEvaluatorThen,
	OverpassEvaluator,
	OverpassEvaluatorExpression,
	OverpassEvaluatorNode,
	OverpassExpression,
} from "@/model";
import { OverpassNotEvaluatorNode } from "./not";
import { OverpassOperatorEvaluatorNode } from "./operators";

export class OverpassBooleanEvaluatorNode extends OverpassEvaluatorNodeImp<boolean> {
	constructor(private readonly expression: OverpassExpression<boolean>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.template`"${u.boolean(this.expression)}"`;
	}
}

class OverpassBooleanEvaluatorThenImp<T, E extends OverpassEvaluator<T>> implements OverpassBooleanEvaluatorThen<T, E> {
	constructor(
		private readonly condition: OverpassBooleanEvaluator,
		private readonly ifTrue: E,
	) {}

	else(ifFalse: E): E {
		return this.condition.conditional(this.ifTrue, ifFalse);
	}
}

export class OverpassBooleanEvaluatorImp extends OverpassEvaluatorImp<boolean> implements OverpassBooleanEvaluator {
	static From(value: OverpassEvaluatorExpression<boolean>): OverpassBooleanEvaluator {
		if (value instanceof OverpassBooleanEvaluatorImp) {
			return value;
		} else {
			return new OverpassBooleanEvaluatorImp(
				new OverpassBooleanEvaluatorNode(value as OverpassExpression<boolean>),
			);
		}
	}

	protected evaluatorFromRawExp(expression: OverpassExpression<boolean>): OverpassEvaluator<boolean> {
		return new OverpassBooleanEvaluatorImp(new OverpassBooleanEvaluatorNode(expression));
	}

	with(node: OverpassEvaluatorNode<boolean>): OverpassEvaluator<boolean> {
		return new OverpassBooleanEvaluatorImp(node);
	}

	not(): OverpassBooleanEvaluator {
		return new OverpassBooleanEvaluatorImp(new OverpassNotEvaluatorNode(this));
	}

	or(...conditions: OverpassEvaluatorExpression<boolean>[]): OverpassBooleanEvaluator {
		return new OverpassBooleanEvaluatorImp(
			new OverpassOperatorEvaluatorNode("||", [
				this,
				...conditions.map((condition) => this.evaluatorFromExp(condition)),
			]),
		);
	}

	and(...conditions: OverpassEvaluatorExpression<boolean>[]): OverpassBooleanEvaluator {
		return new OverpassBooleanEvaluatorImp(
			new OverpassOperatorEvaluatorNode("&&", [
				this,
				...conditions.map((condition) => this.evaluatorFromExp(condition)),
			]),
		);
	}

	conditional<T, E extends OverpassEvaluator<T>>(ifTrue: E, ifFalse: E): E {
		return ifTrue.with(new OverpassConditionalEvaluatorNode<T, E>(this, ifTrue, ifFalse)) as E;
	}

	then<T, E extends OverpassEvaluator<T>>(ifTrue: E): OverpassBooleanEvaluatorThen<T, E> {
		return new OverpassBooleanEvaluatorThenImp(this, ifTrue);
	}
}

OverpassEvaluatorImp.OverpassBooleanEvaluator = OverpassBooleanEvaluatorImp;
