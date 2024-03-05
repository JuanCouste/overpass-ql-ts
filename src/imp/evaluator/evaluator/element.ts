import { CompileUtils, CompiledItem, OverpassExpression } from "@/model";
import { OverpassEvaluatorNodeImp } from "./node";

export class OverpassElementIdEvaluatorNode extends OverpassEvaluatorNodeImp<number> {
	compile(u: CompileUtils): CompiledItem {
		return u.raw("id()");
	}
}

export class OverpassElementTypeEvaluatorNode extends OverpassEvaluatorNodeImp<string> {
	compile(u: CompileUtils): CompiledItem {
		return u.raw("type()");
	}
}

export class OverpassElementHasTypeEvaluatorNode extends OverpassEvaluatorNodeImp<boolean> {
	constructor(private readonly tag: OverpassExpression<string>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.template`is_tag(${u.qString(this.tag)})`;
	}
}

export class OverpassElementGetTypeEvaluatorNode extends OverpassEvaluatorNodeImp<string> {
	constructor(private readonly tag: OverpassExpression<string>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.template`t[${u.qString(this.tag)}]`;
	}
}
