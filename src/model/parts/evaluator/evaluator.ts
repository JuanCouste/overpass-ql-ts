import { CompiledItem } from "@/model/compilable";
import { OverpassExpression } from "@/model/expression";
import { CompilableItem, CompileUtils } from "@/model/parts/compilable";
import { OverpassBooleanEvaluator } from "./boolean";

export type OverpassEvaluatorExpression<T> = OverpassExpression<T> | OverpassEvaluator<T>;

export interface OverpassEvaluatorNode<T> extends CompilableItem {
	/** Just for typing prupposes */
	readonly _$?: T | undefined;

	compile(utils: CompileUtils): CompiledItem;
}

export interface OverpassEvaluator<T> extends CompilableItem {
	readonly node: OverpassEvaluatorNode<T>;

	eq(evaluator: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator;
	neq(evaluator: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator;

	with(node: OverpassEvaluatorNode<T>): OverpassEvaluator<T>;
}
