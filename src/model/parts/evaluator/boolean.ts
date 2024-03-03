import { OverpassEvaluator, OverpassEvaluatorExpression } from "./evaluator";

export interface OverpassBooleanEvaluatorThen<E extends OverpassEvaluatorExpression<any>> {
	else(evaluator: E): E;
}

export interface OverpassBooleanEvaluator extends OverpassEvaluator<boolean> {
	not(): OverpassBooleanEvaluator;

	or(...conditions: OverpassEvaluatorExpression<boolean>[]): OverpassBooleanEvaluator;
	and(...conditions: OverpassEvaluatorExpression<boolean>[]): OverpassBooleanEvaluator;

	conditional<E extends OverpassEvaluatorExpression<any>>(ifTrue: E, ifFalse: E): E;

	then<E extends OverpassEvaluatorExpression<any>>(evaluator: E): OverpassBooleanEvaluatorThen<E>;
}
