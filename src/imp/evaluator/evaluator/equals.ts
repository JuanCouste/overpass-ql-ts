import { CompileUtils, CompiledItem, OverpassEvaluator } from "@/model";
import { OverpassEvaluatorNodeImp } from "./node";

export class OverpassEqualsEvaluatorNode<T> extends OverpassEvaluatorNodeImp<boolean> {
	constructor(private readonly self: OverpassEvaluator<T>, private readonly other: OverpassEvaluator<T>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.template`(${this.self.compile(u)} == ${this.other.compile(u)})`;
	}
}

export class OverpassNotEqualsEvaluatorNode<T> extends OverpassEvaluatorNodeImp<boolean> {
	constructor(private readonly self: OverpassEvaluator<T>, private readonly other: OverpassEvaluator<T>) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return u.template`(${this.self.compile(u)} != ${this.other.compile(u)})`;
	}
}
