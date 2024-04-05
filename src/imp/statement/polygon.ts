import {
	CompileUtils,
	CompiledItem,
	OverpassChainableTargetableState,
	OverpassExpression,
	OverpassGeoPos,
	OverpassStatementTarget,
} from "@/model";
import { ChainableOverpassStatementBase } from "./base";

export class OverpassInsidePolygonStatement extends ChainableOverpassStatementBase {
	constructor(
		target: OverpassStatementTarget,
		chain: OverpassChainableTargetableState,
		private readonly polygon: OverpassExpression<OverpassGeoPos>[],
	) {
		super(target, chain);
	}

	compileChainable(u: CompileUtils): CompiledItem[] {
		const polygon = this.polygon.map((geoPos) => {
			const { lat, lon } = u.geoPos(geoPos);
			return u.template`${lat} ${lon}`;
		});

		return [u.template`(poly: "${u.join(polygon, " ")}")`];
	}
}
