import {
	CompileUtils,
	CompiledItem,
	OverpassChainableTargetableState,
	OverpassExpression,
	OverpassGeoPos,
	OverpassStatementTarget,
} from "@/model";
import { ChainableOverpassStatementBase } from "./base";

export class OverpassAroundCenterStatement extends ChainableOverpassStatementBase {
	constructor(
		target: OverpassStatementTarget,
		chain: OverpassChainableTargetableState,
		private readonly radius: OverpassExpression<number>,
		private readonly center: OverpassExpression<OverpassGeoPos>,
	) {
		super(target, chain);
	}

	compileChainable(u: CompileUtils): CompiledItem<string>[] {
		const radius = u.number(this.radius);
		const { lat, lon } = u.geoPos(this.center);
		return [u.template`(around: ${radius}, ${lat}, ${lon})`];
	}
}

export class OverpassAroundSetStatement extends ChainableOverpassStatementBase {
	constructor(
		target: OverpassStatementTarget,
		chain: OverpassChainableTargetableState,
		private readonly radius: OverpassExpression<number>,
		private readonly set?: OverpassExpression<string>,
	) {
		super(target, chain);
	}

	compileChainable(u: CompileUtils): CompiledItem<string>[] {
		const radius = u.number(this.radius);
		if (this.set != null) return [u.template`(around.${u.set(this.set)}: ${radius})`];
		else return [u.template`(around: ${radius})`];
	}
}

export class OverpassAroundLineStatement extends ChainableOverpassStatementBase {
	constructor(
		target: OverpassStatementTarget,
		chain: OverpassChainableTargetableState,
		private readonly radius: OverpassExpression<number>,
		private readonly line: OverpassExpression<OverpassGeoPos>[],
	) {
		super(target, chain);
	}

	compileChainable(u: CompileUtils): CompiledItem<string>[] {
		const radius = u.number(this.radius);

		const line = this.line.map((geoPos) => {
			const { lat, lon } = u.geoPos(geoPos);
			return u.template`${lat}, ${lon}`;
		});

		return [u.template`(around: ${radius}, ${u.join(line, ", ")})`];
	}
}
