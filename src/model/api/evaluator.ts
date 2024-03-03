import { OverpassExpression } from "@/model/expression";
import {
	OverpassBooleanEvaluator,
	OverpassDateEvaluator,
	OverpassEvaluatorExpression,
	OverpassNumberEvaluator,
	OverpassStringEvaluator,
} from "@/model/parts";

export interface OverpassEvaluatorBuilder {
	readonly true: OverpassBooleanEvaluator;
	readonly false: OverpassBooleanEvaluator;

	conditional<E extends OverpassEvaluatorExpression<any>>(
		condition: OverpassEvaluatorExpression<boolean>,
		ifTrue: E,
		ifFalse: E,
	): E;

	or(...conditions: OverpassEvaluatorExpression<boolean>[]): OverpassBooleanEvaluator;
	and(...conditions: OverpassEvaluatorExpression<boolean>[]): OverpassBooleanEvaluator;

	number(value: OverpassExpression<number>): OverpassNumberEvaluator;
	string(value: OverpassExpression<string>): OverpassStringEvaluator;
	date(value: OverpassExpression<Date>): OverpassDateEvaluator;
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
