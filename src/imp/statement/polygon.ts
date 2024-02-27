import { CompileUtils, CompiledItem, OverpassExpression, OverpassGeoPos, OverpassStatementTarget } from "@/model";
import { ComposableOverpassStatementBase } from "./base";

export class OverpassInsidePolygonStatement extends ComposableOverpassStatementBase {
	constructor(
		private readonly target: OverpassStatementTarget,
		private readonly polygon: OverpassExpression<OverpassGeoPos>[],
	) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		const target = this.target.compile(u);

		const polygon = this.polygon.map((geoPos) => {
			const { lat, lon } = u.geoPos(geoPos);
			return u.template`${lat} ${lon}`;
		});

		return u.template`${target}(poly: "${u.join(polygon, " ")}")`;
	}
}
