import { OverpassEvaluatorExpression } from "./evaluator";
import { OverpassMagnitudeEvaluator } from "./magnitude";

export enum OverpassArithmeticOperator {
	Add,
	Sub,
	Mult,
	Divide,
}

export interface OverpassNumberEvaluator extends OverpassMagnitudeEvaluator<number> {
	abs(): OverpassNumberEvaluator;

	op(op: OverpassArithmeticOperator, number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator;

	plus(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator;
	minus(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator;
	times(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator;
	dividedBy(number: OverpassEvaluatorExpression<number>): OverpassNumberEvaluator;
}
