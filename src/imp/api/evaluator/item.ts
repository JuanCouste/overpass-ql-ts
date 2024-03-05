import {
	OverpassBooleanEvaluatorImp,
	OverpassCountByRoleDistinctEvaluatorNode,
	OverpassCountByRoleEvaluatorNode,
	OverpassCountMembersDistinctEvaluatorNode,
	OverpassCountMembersEvaluatorNode,
	OverpassCountTagsEvaluatorNode,
	OverpassElementGetTypeEvaluatorNode,
	OverpassElementHasTypeEvaluatorNode,
	OverpassElementIdEvaluatorNode,
	OverpassElementTypeEvaluatorNode,
	OverpassNumberEvaluatorImp,
	OverpassStringEvaluatorImp,
} from "@/imp/evaluator";
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
		return new OverpassNumberEvaluatorImp(new OverpassCountTagsEvaluatorNode());
	}

	members(): OverpassNumberEvaluator {
		return new OverpassNumberEvaluatorImp(new OverpassCountMembersEvaluatorNode());
	}

	membersDistinct(): OverpassNumberEvaluator {
		return new OverpassNumberEvaluatorImp(new OverpassCountMembersDistinctEvaluatorNode());
	}

	byRole(role: OverpassEvaluatorExpression<string>): OverpassNumberEvaluator {
		return new OverpassNumberEvaluatorImp(
			new OverpassCountByRoleEvaluatorNode(OverpassStringEvaluatorImp.From(role)),
		);
	}

	byRoleDistinct(role: OverpassEvaluatorExpression<string>): OverpassNumberEvaluator {
		return new OverpassNumberEvaluatorImp(
			new OverpassCountByRoleDistinctEvaluatorNode(OverpassStringEvaluatorImp.From(role)),
		);
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
		return new OverpassStringEvaluatorImp(new OverpassElementTypeEvaluatorNode());
	}

	hasTag(tag: OverpassExpression<string>): OverpassBooleanEvaluator {
		return new OverpassBooleanEvaluatorImp(new OverpassElementHasTypeEvaluatorNode(tag));
	}

	getTag(tag: OverpassExpression<string>): OverpassStringEvaluator {
		return new OverpassStringEvaluatorImp(new OverpassElementGetTypeEvaluatorNode(tag));
	}
}
