import { CompileUtils, CompiledItem, OverpassEvaluator } from "@/model";
import { OverpassEvaluatorNodeImp } from "./node";

export class OverpassCountTagsEvaluatorNode extends OverpassEvaluatorNodeImp<number> {
	compile(u: CompileUtils): CompiledItem {
		return u.raw("count_tags()");
	}
}

export class OverpassCountMembersEvaluatorNode extends OverpassEvaluatorNodeImp<number> {
	compile(u: CompileUtils): CompiledItem {
		return u.raw("count_members()");
	}
}

export class OverpassCountMembersDistinctEvaluatorNode extends OverpassEvaluatorNodeImp<number> {
	compile(u: CompileUtils): CompiledItem {
		return u.raw("count_distinct_members()");
	}
}

export class OverpassCountByRoleEvaluatorNode extends OverpassEvaluatorNodeImp<number> {
	constructor(private readonly role: OverpassEvaluator<string>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.template`count_by_role(${this.role.compile(u)})`;
	}
}

export class OverpassCountByRoleDistinctEvaluatorNode extends OverpassEvaluatorNodeImp<number> {
	constructor(private readonly role: OverpassEvaluator<string>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.template`count_distinct_by_role(${this.role.compile(u)})`;
	}
}
