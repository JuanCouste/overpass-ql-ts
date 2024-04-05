import {
	ChainableOverpassStatementBase,
	OverpassBBoxStatement,
	OverpassByIdStatement,
	OverpassIfFilterStatement,
	OverpassInsidePolygonStatement,
	OverpassQueryStatement,
} from "@/imp/statement";
import {
	AnyOverpassFilter,
	CompileUtils,
	OverpassBoundingBox,
	OverpassChainableTargetableState,
	OverpassEvaluator,
	OverpassExpression,
	OverpassFilter,
	OverpassFilterBuilder,
	OverpassFilterHelper,
	OverpassGeoPos,
	OverpassItemEvaluatorBuilder,
	OverpassParameterError,
	OverpassPolygonCoordExpression,
	OverpassQueryFilter,
	OverpassQueryFilterFunction,
	OverpassQueryFilterTuple,
	OverpassQueryRegExpFilterTuple,
	OverpassStatementTarget,
	OverpassTargetState,
	ParamType,
} from "@/model";

export abstract class OverpassTargetStateBase implements OverpassTargetState {
	constructor(
		protected readonly target: OverpassStatementTarget,
		protected readonly chain: OverpassChainableTargetableState,
		protected readonly utils: CompileUtils,
		protected readonly filterBuilder: OverpassFilterBuilder,
		protected readonly evaluatorItemBuilder: OverpassItemEvaluatorBuilder,
	) {
		if (chain == null) {
			chain = this;
		}
	}

	private isRegExpTuple(tuple: OverpassQueryFilterTuple): tuple is OverpassQueryRegExpFilterTuple {
		const prop = tuple[0];
		return prop instanceof RegExp || this.utils.isSpecificParam<RegExp>(prop, ParamType.RegExp);
	}

	private anyFilterToHelper(anyFilter: AnyOverpassFilter): OverpassFilterHelper {
		if (anyFilter == null) {
			throw new OverpassParameterError(`Unexpected query filter value null`);
		} else if (typeof anyFilter == "string" || this.utils.isSpecificParam<string>(anyFilter, ParamType.String)) {
			return this.filterBuilder.equals(anyFilter);
		} else if (anyFilter instanceof RegExp || this.utils.isSpecificParam<RegExp>(anyFilter, ParamType.RegExp)) {
			return this.filterBuilder.regExp(anyFilter);
		} else {
			return anyFilter;
		}
	}

	query(filter: OverpassQueryFilter | OverpassQueryFilterFunction): ChainableOverpassStatementBase {
		const filters: OverpassFilter[] = [];

		let filterData: OverpassQueryFilter;
		if (typeof filter == "function") {
			filterData = filter(this.filterBuilder);
		} else {
			filterData = filter;
		}

		if (filterData instanceof Array) {
			filterData.forEach((tuple) => {
				if (this.isRegExpTuple(tuple)) {
					const [regExpProp, value] = tuple;
					filters.push(this.filterBuilder.regExp(value).complete(regExpProp));
				} else {
					const [prop, value] = tuple;
					filters.push(this.anyFilterToHelper(value).complete(prop));
				}
			});
		} else {
			Object.entries(filterData).forEach(([prop, anyFilterValue]) => {
				if (anyFilterValue instanceof Array) {
					filters.push(
						...anyFilterValue.map((anyFilter) => this.anyFilterToHelper(anyFilter).complete(prop)),
					);
				} else {
					filters.push(this.anyFilterToHelper(anyFilterValue).complete(prop));
				}
			});
		}

		return new OverpassQueryStatement(this.target, this.chain, filters);
	}

	bbox(south: number, west: number, north: number, east: number): ChainableOverpassStatementBase;
	bbox(bbox: OverpassExpression<OverpassBoundingBox>): ChainableOverpassStatementBase;
	bbox(p1: number | OverpassExpression<OverpassBoundingBox>, ...rest: number[]): ChainableOverpassStatementBase {
		const bbox: OverpassExpression<OverpassBoundingBox> =
			typeof p1 == "number" ? ([p1, ...rest] as OverpassBoundingBox) : p1;
		return new OverpassBBoxStatement(this.target, this.chain, bbox);
	}

	byId(id: OverpassExpression<number>): ChainableOverpassStatementBase {
		return new OverpassByIdStatement(this.target, this.chain, id);
	}

	inside(polygon: OverpassExpression<OverpassPolygonCoordExpression>[]): ChainableOverpassStatementBase {
		return new OverpassInsidePolygonStatement(
			this.target,
			this.chain,
			polygon.map<OverpassExpression<OverpassGeoPos>>((coord) =>
				coord instanceof Array ? { lat: coord[0], lon: coord[1] } : coord,
			),
		);
	}

	filter(predicate: (e: OverpassItemEvaluatorBuilder) => OverpassEvaluator<boolean>): ChainableOverpassStatementBase {
		return new OverpassIfFilterStatement(this.target, this.chain, predicate(this.evaluatorItemBuilder));
	}
}
