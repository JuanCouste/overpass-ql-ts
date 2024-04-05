import {
	CompileUtils,
	CompiledItem,
	OverpassBoundingBox,
	OverpassChainableTargetableState,
	OverpassExpression,
	OverpassStatementTarget,
} from "@/model";
import { ChainableOverpassStatementBase } from "./base";

export class OverpassBBoxStatement extends ChainableOverpassStatementBase {
	constructor(
		target: OverpassStatementTarget,
		chain: OverpassChainableTargetableState,
		private readonly bbox: OverpassExpression<OverpassBoundingBox>,
	) {
		super(target, chain);
	}

	compileChainable(u: CompileUtils): CompiledItem[] {
		const [south, west, north, east] = u.bbox(this.bbox);
		return [u.template`(${south}, ${west}, ${north}, ${east})`];
	}
}
