import { CompiledItem } from "@/model/compilable";
import { OverpassExpression } from "@/model/expression";
import { CompilableItem, CompileUtils } from "./compilable";

export interface OverpassStatement extends CompilableItem {}

export interface ComposableOverpassStatement extends OverpassStatement {
	/** Join the elements of the current statement with those of {@link statements} */
	union(...statements: ComposableOverpassStatement[]): ComposableOverpassStatement;
	/** Keep the elements that are in the current statement, but not in {@link statement} */
	difference(statement: ComposableOverpassStatement): ComposableOverpassStatement;

	/** Saves the current statement to {@link set} */
	toSet(set: OverpassExpression<string>): ComposableOverpassStatement;
}

export interface ChainableOverpassStatement extends ComposableOverpassStatement {
	compileChainable(utils: CompileUtils): CompiledItem<string>[];
}

export interface OverpassStatementTarget extends CompilableItem {
	withIntersection(set1: OverpassExpression<string>, ...sets: OverpassExpression<string>[]): OverpassStatementTarget;
}
