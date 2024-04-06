import {
	CompileUtils,
	CompiledItem,
	OverpassChainableTargetableState,
	OverpassStatementTarget,
	OverpassTagFilter,
} from "@/model";
import { ChainableOverpassStatementBase } from "./base";

export class OverpassByTagsStatement extends ChainableOverpassStatementBase {
	constructor(
		target: OverpassStatementTarget,
		chain: OverpassChainableTargetableState,
		private readonly tags: OverpassTagFilter[],
	) {
		super(target, chain);
	}

	compileChainable(u: CompileUtils): CompiledItem[] {
		return this.tags.map((tag) => tag.compile(u));
	}
}
