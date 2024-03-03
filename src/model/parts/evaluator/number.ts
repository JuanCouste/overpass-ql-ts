import { OverpassEvaluatorExpression } from "./evaluator";
import { OverpassMagnitudeEvaluator } from "./magnitude";

export interface OverpassNumberEvaluator extends OverpassMagnitudeEvaluator<number> {
	abs(): OverpassNumberEvaluator;

	plus(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator;
	minus(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator;
	times(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator;
	dividedBy(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator;
}
