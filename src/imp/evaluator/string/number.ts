import { OverpassEvaluatorNodeImp } from "@/imp/evaluator/evaluator";
import { CompileUtils, CompiledItem, OverpassEvaluator } from "@/model";

export class OverpassIsNumberEvaluatorNode extends OverpassEvaluatorNodeImp<boolean> {
	constructor(private readonly self: OverpassEvaluator<string>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.template`is_number(${this.self.compile(u)})`;
	}
}

export class OverpassParseNumberEvaluatorNode extends OverpassEvaluatorNodeImp<number> {
	constructor(private readonly self: OverpassEvaluator<string>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.template`number(${this.self.compile(u)})`;
	}
}
