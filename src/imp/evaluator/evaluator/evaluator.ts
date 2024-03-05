import {
	CompileUtils,
	CompiledItem,
	OverpassBooleanEvaluator,
	OverpassEvaluator,
	OverpassEvaluatorExpression,
	OverpassEvaluatorNode,
	OverpassExpression,
} from "@/model";
import { OverpassEqualsEvaluatorNode, OverpassNotEqualsEvaluatorNode } from "./equals";

export abstract class OverpassEvaluatorImp<T> implements OverpassEvaluator<T> {
	static OverpassBooleanEvaluator: new (node: OverpassEvaluatorNode<boolean>) => OverpassBooleanEvaluator;

	readonly _$?: T | undefined;

	constructor(public readonly node: OverpassEvaluatorNode<T>) {}

	protected abstract evaluatorFromRawExp(expression: OverpassExpression<T>): OverpassEvaluator<T>;

	protected evaluatorFromExp(evaluator: OverpassEvaluatorExpression<T>): OverpassEvaluator<T> {
		return evaluator instanceof OverpassEvaluatorImp
			? evaluator
			: this.evaluatorFromRawExp(evaluator as OverpassExpression<T>);
	}

	eq(evaluator: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator {
		return new OverpassEvaluatorImp.OverpassBooleanEvaluator(
			new OverpassEqualsEvaluatorNode<T>(this, this.evaluatorFromExp(evaluator)),
		);
	}

	neq(evaluator: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator {
		return new OverpassEvaluatorImp.OverpassBooleanEvaluator(
			new OverpassNotEqualsEvaluatorNode<T>(this, this.evaluatorFromExp(evaluator)),
		);
	}

	compile(utils: CompileUtils): CompiledItem {
		return this.node.compile(utils);
	}

	abstract with(node: OverpassEvaluatorNode<T>): OverpassEvaluator<T>;
}
