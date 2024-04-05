import {
	CompileUtils,
	CompiledItem,
	OverpassChainableTargetableState,
	OverpassExpression,
	OverpassStatementTarget,
} from "@/model";
import { ChainableOverpassStatementBase } from "./base";

export class OverpassByIdStatement extends ChainableOverpassStatementBase {
	constructor(
		target: OverpassStatementTarget,
		chain: OverpassChainableTargetableState,
		private readonly id: OverpassExpression<number>,
	) {
		super(target, chain);
	}

	compileChainable(u: CompileUtils): CompiledItem[] {
		const id = u.number(this.id);
		return [u.template`(${id})`];
	}
}
