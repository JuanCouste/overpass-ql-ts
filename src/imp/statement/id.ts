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
		private readonly id: OverpassExpression<number> | OverpassExpression<number>[],
	) {
		super(target, chain);
	}

	compileChainable(u: CompileUtils): CompiledItem<string>[] {
		if (this.id instanceof Array) {
			const ids = this.id.map((id) => u.number(id));
			return [u.template`(id:${u.join(ids, ", ")})`];
		} else {
			return [u.template`(${u.number(this.id)})`];
		}
	}
}
