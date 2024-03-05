import { OverpassEvaluator, OverpassEvaluatorExpression } from "./evaluator";

export interface OverpassBooleanEvaluatorThen<T, E extends OverpassEvaluator<T>> {
	else(evaluator: E): E;
}

export interface OverpassBooleanEvaluator extends OverpassEvaluator<boolean> {
	not(): OverpassBooleanEvaluator;

	or(...conditions: OverpassEvaluatorExpression<boolean>[]): OverpassBooleanEvaluator;
	and(...conditions: OverpassEvaluatorExpression<boolean>[]): OverpassBooleanEvaluator;

	conditional<T, E extends OverpassEvaluator<T>>(ifTrue: E, ifFalse: E): E;

	then<T, E extends OverpassEvaluator<T>>(evaluator: E): OverpassBooleanEvaluatorThen<T, E>;
}
