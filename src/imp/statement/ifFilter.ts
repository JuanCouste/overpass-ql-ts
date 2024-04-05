import {
	CompileUtils,
	CompiledItem,
	OverpassChainableTargetableState,
	OverpassEvaluator,
	OverpassStatementTarget,
} from "@/model";
import { ChainableOverpassStatementBase } from "./base";

export class OverpassIfFilterStatement extends ChainableOverpassStatementBase {
	constructor(
		target: OverpassStatementTarget,
		chain: OverpassChainableTargetableState,
		private readonly predicate: OverpassEvaluator<boolean>,
	) {
		super(target, chain);
	}

	compileChainable(u: CompileUtils): CompiledItem[] {
		return [u.template`(if: ${this.predicate.compile(u)})`];
	}
}
