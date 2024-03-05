import { OverpassBooleanEvaluator } from "./boolean";
import { OverpassEvaluator, OverpassEvaluatorExpression } from "./evaluator";

export enum OverpasComparissonOperator {
	Lower,
	LowerOrEquals,
	GreaterOrEquals,
	Greater,
}

export interface OverpassMagnitudeEvaluator<T extends number | Date> extends OverpassEvaluator<T> {
	compare(op: OverpasComparissonOperator, right: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator;
	lt(right: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator;
	le(right: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator;
	ge(right: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator;
	gt(right: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator;
}
