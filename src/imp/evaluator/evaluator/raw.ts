import { CompileFunction, CompileUtils, CompiledItem } from "@/model";
import { OverpassEvaluatorNodeImp } from "./node";

export class OverpassRawEvaluatorNode<T> extends OverpassEvaluatorNodeImp<T> {
	constructor(private readonly compileFn: CompileFunction) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return this.compileFn(u);
	}
}
