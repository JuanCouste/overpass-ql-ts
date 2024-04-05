import { OverpassExpression } from "@/model/expression";
import {
	CompileFunction,
	OverpassBooleanEvaluator,
	OverpassDateEvaluator,
	OverpassEvaluator,
	OverpassEvaluatorExpression,
	OverpassNumberEvaluator,
	OverpassStringEvaluator,
} from "@/model/parts";

export interface OverpassEvaluatorBuilder {
	readonly true: OverpassBooleanEvaluator;
	readonly false: OverpassBooleanEvaluator;

	conditional<T, E extends OverpassEvaluator<T>>(
		condition: OverpassEvaluatorExpression<boolean>,
		ifTrue: E,
		ifFalse: E,
	): E;

	or(
		condition: OverpassEvaluatorExpression<boolean>,
		...conditions: OverpassEvaluatorExpression<boolean>[]
	): OverpassBooleanEvaluator;
	and(
		condition: OverpassEvaluatorExpression<boolean>,
		...conditions: OverpassEvaluatorExpression<boolean>[]
	): OverpassBooleanEvaluator;

	number(value: OverpassExpression<number> | CompileFunction): OverpassNumberEvaluator;
	string(value: OverpassExpression<string> | CompileFunction): OverpassStringEvaluator;
	date(value: OverpassExpression<Date> | CompileFunction): OverpassDateEvaluator;
	boolean(value: OverpassExpression<boolean> | CompileFunction): OverpassBooleanEvaluator;
}

export interface OverpassItemEvaluatorBuilder extends OverpassEvaluatorBuilder {
	id(): OverpassNumberEvaluator;
	type(): OverpassStringEvaluator;

	hasTag(tag: OverpassExpression<string>): OverpassBooleanEvaluator;
	getTag(tag: OverpassExpression<string>): OverpassStringEvaluator;

	readonly count: OverpassItemEvaluatorCountBuilder;
}

export interface OverpassItemEvaluatorCountBuilder {
	tags(): OverpassNumberEvaluator;
	members(): OverpassNumberEvaluator;
	membersDistinct(): OverpassNumberEvaluator;
	byRole(role: OverpassEvaluatorExpression<string>): OverpassNumberEvaluator;
	byRoleDistinct(role: OverpassEvaluatorExpression<string>): OverpassNumberEvaluator;
}
