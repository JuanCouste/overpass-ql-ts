import { OverpassExpression } from "@/model/expression";
import { CompilableItem } from "../compilable";
import { OverpassBooleanEvaluator } from "./boolean";

export type OverpassEvaluatorExpression<T> = OverpassExpression<T> | OverpassEvaluator<T>;

export interface OverpassEvaluator<T> extends CompilableItem {
	/** Just for typing prupposes */
	readonly _$?: T | undefined;

	equals(evaluator: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator;
	notEquals(evaluator: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator;
}
