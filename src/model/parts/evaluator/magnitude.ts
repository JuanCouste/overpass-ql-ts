import { OverpassBooleanEvaluator } from "./boolean";
import { OverpassEvaluator, OverpassEvaluatorExpression } from "./evaluator";

export interface OverpassMagnitudeEvaluator<T extends number | Date> extends OverpassEvaluator<T> {
	lt(evaluator: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator;
	le(evaluator: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator;
	ge(evaluator: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator;
	gt(evaluator: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator;
}
