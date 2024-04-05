import { OverpassDateEvaluatorImp } from "@/imp/evaluator/date";
import { OverpassEvaluatorImp, OverpassEvaluatorNodeImp } from "@/imp/evaluator/evaluator";
import { OverpassNumberEvaluatorImp } from "@/imp/evaluator/number";
import {
	CompileUtils,
	CompiledItem,
	OverpassBooleanEvaluator,
	OverpassDateEvaluator,
	OverpassEvaluator,
	OverpassEvaluatorExpression,
	OverpassEvaluatorNode,
	OverpassExpression,
	OverpassNumberEvaluator,
	OverpassStringEvaluator,
} from "@/model";
import { OverpassBooleanEvaluatorImp } from "../boolean";
import { OverpassAsBooleanEvaluatorNode } from "./boolean";
import { OverpassIsDateEvaluatorNode, OverpassParseDateEvaluatorNode } from "./date";
import { OverpassIsNumberEvaluatorNode, OverpassParseNumberEvaluatorNode } from "./number";

export class OverpassStringEvaluatorNode extends OverpassEvaluatorNodeImp<string> {
	constructor(private readonly expression: OverpassExpression<string>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.qString(this.expression);
	}
}

export class OverpassStringEvaluatorImp extends OverpassEvaluatorImp<string> implements OverpassStringEvaluator {
	static From(value: OverpassEvaluatorExpression<string>): OverpassStringEvaluator {
		if (value instanceof OverpassStringEvaluatorImp) {
			return value;
		} else {
			return new OverpassStringEvaluatorImp(new OverpassStringEvaluatorNode(value as OverpassExpression<string>));
		}
	}

	protected evaluatorFromRawExp(expression: OverpassExpression<string>): OverpassEvaluator<string> {
		return new OverpassStringEvaluatorImp(new OverpassStringEvaluatorNode(expression));
	}

	with(node: OverpassEvaluatorNode<string>): OverpassEvaluator<string> {
		return new OverpassStringEvaluatorImp(node);
	}

	isNumber(): OverpassBooleanEvaluator {
		return new OverpassEvaluatorImp.OverpassBooleanEvaluator(new OverpassIsNumberEvaluatorNode(this));
	}

	parseNumber(): OverpassNumberEvaluator {
		return new OverpassNumberEvaluatorImp(new OverpassParseNumberEvaluatorNode(this));
	}

	isDate(): OverpassBooleanEvaluator {
		return new OverpassEvaluatorImp.OverpassBooleanEvaluator(new OverpassIsDateEvaluatorNode(this));
	}

	parseDate(): OverpassDateEvaluator {
		return new OverpassDateEvaluatorImp(new OverpassParseDateEvaluatorNode(this));
	}

	asBool(): OverpassBooleanEvaluator {
		return new OverpassBooleanEvaluatorImp(new OverpassAsBooleanEvaluatorNode(this));
	}
}
