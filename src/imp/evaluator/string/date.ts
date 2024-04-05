import { OverpassEvaluatorNodeImp } from "@/imp/evaluator/evaluator";
import { CompileUtils, CompiledItem, OverpassEvaluator } from "@/model";

export class OverpassIsDateEvaluatorNode extends OverpassEvaluatorNodeImp<boolean> {
	constructor(private readonly self: OverpassEvaluator<string>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.template`is_date(${this.self.compile(u)})`;
	}
}

export class OverpassParseDateEvaluatorNode extends OverpassEvaluatorNodeImp<Date> {
	constructor(private readonly self: OverpassEvaluator<string>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.template`date(${this.self.compile(u)})`;
	}
}
