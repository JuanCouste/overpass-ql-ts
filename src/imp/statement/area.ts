import {
	CompileUtils,
	CompiledItem,
	OverpassChainableTargetableState,
	OverpassExpression,
	OverpassStatementTarget,
} from "@/model";
import { ChainableOverpassStatementBase } from "./base";

export class OverpassAreaStatement extends ChainableOverpassStatementBase {
	constructor(
		target: OverpassStatementTarget,
		chain: OverpassChainableTargetableState,
		private readonly set?: OverpassExpression<string>,
	) {
		super(target, chain);
	}

	compileChainable(u: CompileUtils): CompiledItem<string>[] {
		if (this.set != null) return [u.template`(area.${u.set(this.set)})`];
		else return [u.raw("(area)")];
	}
}

export class OverpassPivotStatement extends ChainableOverpassStatementBase {
	constructor(
		target: OverpassStatementTarget,
		chain: OverpassChainableTargetableState,
		private readonly set?: OverpassExpression<string>,
	) {
		super(target, chain);
	}

	compileChainable(u: CompileUtils): CompiledItem<string>[] {
		if (this.set != null) return [u.template`(pivot.${u.set(this.set)})`];
		else return [u.raw("(pivot)")];
	}
}
