import {
	CompileUtils,
	CompiledItem,
	OverpassChainableTargetableState,
	OverpassFilter,
	OverpassStatementTarget,
} from "@/model";
import { ChainableOverpassStatementBase } from "./base";

export class OverpassQueryStatement extends ChainableOverpassStatementBase {
	constructor(
		target: OverpassStatementTarget,
		chain: OverpassChainableTargetableState,
		private readonly filters: OverpassFilter[],
	) {
		super(target, chain);
	}

	compileChainable(u: CompileUtils): CompiledItem[] {
		return this.filters.map((filter) => filter.compile(u));
	}
}
