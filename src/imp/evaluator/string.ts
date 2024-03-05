import {
	CompileUtils,
	CompiledItem,
	OverpassBooleanEvaluator,
	OverpassDateEvaluator,
	OverpassEvaluator,
	OverpassEvaluatorNode,
	OverpassExpression,
	OverpassNumberEvaluator,
	OverpassStringEvaluator,
} from "@/model";
import { OverpassEvaluatorImp, OverpassEvaluatorNodeImp } from "./evaluator";

export class OverpassStringEvaluatorNode extends OverpassEvaluatorNodeImp<string> {
	constructor(private readonly expression: OverpassExpression<string>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.qString(this.expression);
	}
}

export class OverpassStringEvaluatorImp extends OverpassEvaluatorImp<string> implements OverpassStringEvaluator {
	static From(value: OverpassExpression<string>): OverpassStringEvaluator {
		return new OverpassStringEvaluatorImp(new OverpassStringEvaluatorNode(value));
	}

	protected evaluatorFromRawExp(expression: OverpassExpression<string>): OverpassEvaluator<string> {
		return new OverpassStringEvaluatorImp(new OverpassStringEvaluatorNode(expression));
	}

	with(node: OverpassEvaluatorNode<string>): OverpassEvaluator<string> {
		return new OverpassStringEvaluatorImp(node);
	}

	isNumber(): OverpassBooleanEvaluator {
		throw new Error("Method not implemented.");
	}

	parseNumber(): OverpassNumberEvaluator {
		throw new Error("Method not implemented.");
	}

	isDate(): OverpassBooleanEvaluator {
		throw new Error("Method not implemented.");
	}

	parseDate(): OverpassDateEvaluator {
		throw new Error("Method not implemented.");
	}

	asBool(): OverpassBooleanEvaluator {
		throw new Error("Method not implemented.");
	}
}
