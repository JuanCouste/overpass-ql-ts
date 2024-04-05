import { OverpassExpression } from "@/model/expression";
import { CompilableItem } from "./compilable";

export interface OverpassStatement extends CompilableItem {}

export interface ComposableOverpassStatement extends OverpassStatement {
	/** Join the elements of the current statement with those of {@link statement} */
	union(statement: ComposableOverpassStatement): ComposableOverpassStatement;
	/** Keep the elements that are in the current statement, but not in {@link statement} */
	difference(statement: ComposableOverpassStatement): ComposableOverpassStatement;

	/** Saves the current statement to {@link set} */
	toSet(set: OverpassExpression<string>): ComposableOverpassStatement;
}

export interface OverpassStatementTarget extends CompilableItem {
	withIntersection(set1: OverpassExpression<string>, ...sets: OverpassExpression<string>[]): OverpassStatementTarget;
}
