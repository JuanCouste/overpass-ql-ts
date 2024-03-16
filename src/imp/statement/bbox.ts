import { CompileUtils, CompiledItem, OverpassBoundingBox, OverpassExpression, OverpassStatementTarget } from "@/model";
import { ComposableOverpassStatementBase } from "./base";

export class OverpassBBoxStatement extends ComposableOverpassStatementBase {
	constructor(
		private readonly target: OverpassStatementTarget,
		private readonly bbox: OverpassExpression<OverpassBoundingBox>,
	) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		const target = this.target.compile(u);
		const [south, west, north, east] = u.bbox(this.bbox);
		return u.template`${target}(${south}, ${west}, ${north}, ${east})`;
	}
}
