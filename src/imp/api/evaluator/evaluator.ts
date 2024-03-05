import {
	OverpassBooleanEvaluatorImp,
	OverpassDateEvaluatorImp,
	OverpassNumberEvaluatorImp,
	OverpassRawEvaluatorNode,
	OverpassStringEvaluatorImp,
} from "@/imp/evaluator";
import {
	CompileFunction,
	OverpassBooleanEvaluator,
	OverpassDateEvaluator,
	OverpassEvaluator,
	OverpassEvaluatorBuilder,
	OverpassEvaluatorExpression,
	OverpassExpression,
	OverpassNumberEvaluator,
	OverpassStringEvaluator,
} from "@/model";

export class OverpassEvaluatorBuilderImp implements OverpassEvaluatorBuilder {
	public readonly true: OverpassBooleanEvaluator;
	public readonly false: OverpassBooleanEvaluator;

	constructor() {
		this.true = OverpassBooleanEvaluatorImp.From(true);
		this.false = OverpassBooleanEvaluatorImp.From(false);
	}

	conditional<T, E extends OverpassEvaluator<T>>(
		condition: OverpassEvaluatorExpression<boolean>,
		ifTrue: E,
		ifFalse: E,
	): E {
		return OverpassBooleanEvaluatorImp.From(condition).conditional(ifTrue, ifFalse);
	}

	or(
		condition: OverpassEvaluatorExpression<boolean>,
		...conditions: OverpassEvaluatorExpression<boolean>[]
	): OverpassBooleanEvaluator {
		return OverpassBooleanEvaluatorImp.From(condition).or(...conditions);
	}

	and(
		condition: OverpassEvaluatorExpression<boolean>,
		...conditions: OverpassEvaluatorExpression<boolean>[]
	): OverpassBooleanEvaluator {
		return OverpassBooleanEvaluatorImp.From(condition).and(...conditions);
	}

	number(value: OverpassExpression<number> | CompileFunction): OverpassNumberEvaluator {
		return typeof value == "function"
			? new OverpassNumberEvaluatorImp(new OverpassRawEvaluatorNode(value))
			: OverpassNumberEvaluatorImp.From(value);
	}

	string(value: OverpassExpression<string> | CompileFunction): OverpassStringEvaluator {
		return typeof value == "function"
			? new OverpassStringEvaluatorImp(new OverpassRawEvaluatorNode(value))
			: OverpassStringEvaluatorImp.From(value);
	}

	date(value: OverpassExpression<Date> | CompileFunction): OverpassDateEvaluator {
		return typeof value == "function"
			? new OverpassDateEvaluatorImp(new OverpassRawEvaluatorNode(value))
			: OverpassDateEvaluatorImp.From(value);
	}

	boolean(value: OverpassExpression<boolean> | CompileFunction): OverpassBooleanEvaluator {
		return typeof value == "function"
			? new OverpassBooleanEvaluatorImp(new OverpassRawEvaluatorNode(value))
			: OverpassBooleanEvaluatorImp.From(value);
	}
}
