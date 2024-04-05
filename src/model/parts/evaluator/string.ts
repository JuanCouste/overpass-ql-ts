import { OverpassBooleanEvaluator } from "./boolean";
import { OverpassDateEvaluator } from "./date";
import { OverpassEvaluator } from "./evaluator";
import { OverpassNumberEvaluator } from "./number";

export interface OverpassStringEvaluator extends OverpassEvaluator<string> {
	isNumber(): OverpassBooleanEvaluator;
	parseNumber(): OverpassNumberEvaluator;

	isDate(): OverpassBooleanEvaluator;
	parseDate(): OverpassDateEvaluator;

	asBool(): OverpassBooleanEvaluator;
}
