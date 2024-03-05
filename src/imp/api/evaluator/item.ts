import { OverpassElementIdEvaluatorNode, OverpassNumberEvaluatorImp } from "@/imp/evaluator";
import {
	OverpassBooleanEvaluator,
	OverpassEvaluatorExpression,
	OverpassExpression,
	OverpassItemEvaluatorBuilder,
	OverpassItemEvaluatorCountBuilder,
	OverpassNumberEvaluator,
	OverpassStringEvaluator,
} from "@/model";
import { OverpassEvaluatorBuilderImp } from "./evaluator";

export class OverpassItemEvaluatorCountBuilderImp implements OverpassItemEvaluatorCountBuilder {
	tags(): OverpassNumberEvaluator {
		throw new Error("Method not implemented.");
	}
	members(): OverpassNumberEvaluator {
		throw new Error("Method not implemented.");
	}
	membersDistinct(): OverpassNumberEvaluator {
		throw new Error("Method not implemented.");
	}
	byRole(role: OverpassEvaluatorExpression<string>): OverpassNumberEvaluator {
		throw new Error("Method not implemented.");
	}
	byRoleDistinct(role: OverpassEvaluatorExpression<string>): OverpassNumberEvaluator {
		throw new Error("Method not implemented.");
	}
}

export class OverpassItemEvaluatorBuilderImp
	extends OverpassEvaluatorBuilderImp
	implements OverpassItemEvaluatorBuilder
{
	public readonly count: OverpassItemEvaluatorCountBuilder;

	constructor() {
		super();
		this.count = new OverpassItemEvaluatorCountBuilderImp();
	}

	id(): OverpassNumberEvaluator {
		return new OverpassNumberEvaluatorImp(new OverpassElementIdEvaluatorNode());
	}

	type(): OverpassStringEvaluator {
		throw new Error("Method not implemented.");
	}

	hasTag(tag: OverpassExpression<string>): OverpassBooleanEvaluator {
		throw new Error("Method not implemented.");
	}

	getTag(tag: OverpassExpression<string>): OverpassStringEvaluator {
		throw new Error("Method not implemented.");
	}
}
