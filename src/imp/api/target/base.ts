import {
	ChainableOverpassStatementBase,
	OverpassAreaStatement,
	OverpassAroundCenterStatement,
	OverpassAroundLineStatement,
	OverpassAroundSetStatement,
	OverpassBBoxStatement,
	OverpassByIdStatement,
	OverpassByTagsStatement,
	OverpassIfFilterStatement,
	OverpassInsidePolygonStatement,
	OverpassPivotStatement,
	OverpassRecurseFilterStatementImp,
} from "@/imp/statement";
import {
	AnyOverpassTagFilter,
	CompileUtils,
	OverpassBoundingBox,
	OverpassChainableTargetableState,
	OverpassEvaluator,
	OverpassExpression,
	OverpassGeoPos,
	OverpassItemEvaluatorBuilder,
	OverpassParameterError,
	OverpassPositionLiteralExpression,
	OverpassQueryRegExpTagFilterTuple,
	OverpassQueryTagFilterFunction,
	OverpassQueryTagFilterTuple,
	OverpassQueryTagFilters,
	OverpassQueryTarget,
	OverpassQueryTargetExpression,
	OverpassStatementTarget,
	OverpassTagFilter,
	OverpassTagFilterBuilder,
	OverpassTagFilterHelper,
	OverpassTargetState,
	ParamItem,
	ParamType,
	RecurseFromPrimitiveType,
} from "@/model";
import { AnyTargetToQueryTarget } from "./utils";

export abstract class OverpassTargetStateBase implements OverpassTargetState {
	constructor(
		protected readonly target: OverpassStatementTarget,
		protected readonly chain: OverpassChainableTargetableState,
		protected readonly utils: CompileUtils,
		protected readonly tagBuilder: OverpassTagFilterBuilder,
		protected readonly evaluatorItemBuilder: OverpassItemEvaluatorBuilder,
	) {
		if (chain == null) {
			chain = this;
		}
	}

	private isRegExpTuple(tuple: OverpassQueryTagFilterTuple): tuple is OverpassQueryRegExpTagFilterTuple {
		const prop = tuple[0];
		return prop instanceof RegExp || (prop instanceof ParamItem && prop.isType(ParamType.RegExp));
	}

	private anyFilterToHelper(anyTag: AnyOverpassTagFilter): OverpassTagFilterHelper {
		if (anyTag == null) {
			throw new OverpassParameterError(`Unexpected query filter value null`);
		} else if (typeof anyTag == "string" || (anyTag instanceof ParamItem && anyTag.isType(ParamType.String))) {
			return this.tagBuilder.equals(anyTag);
		} else if (anyTag instanceof RegExp || (anyTag instanceof ParamItem && anyTag.isType(ParamType.RegExp))) {
			return this.tagBuilder.regExp(anyTag);
		} else {
			return anyTag as OverpassTagFilterHelper;
		}
	}

	byTags(tagInput: OverpassQueryTagFilters | OverpassQueryTagFilterFunction): ChainableOverpassStatementBase {
		const tags: OverpassTagFilter[] = [];

		let tagData: OverpassQueryTagFilters;
		if (typeof tagInput == "function") {
			tagData = tagInput(this.tagBuilder);
		} else {
			tagData = tagInput;
		}

		if (tagData instanceof Array) {
			tagData.forEach((tuple) => {
				if (this.isRegExpTuple(tuple)) {
					const [regExpProp, value] = tuple;
					tags.push(this.tagBuilder.regExp(value).complete(regExpProp));
				} else {
					const [prop, value] = tuple;
					tags.push(this.anyFilterToHelper(value).complete(prop));
				}
			});
		} else {
			Object.entries(tagData).forEach(([prop, anyTagValue]) => {
				if (anyTagValue instanceof Array) {
					tags.push(...anyTagValue.map((anyTag) => this.anyFilterToHelper(anyTag).complete(prop)));
				} else {
					tags.push(this.anyFilterToHelper(anyTagValue).complete(prop));
				}
			});
		}

		return new OverpassByTagsStatement(this.target, this.chain, tags);
	}

	query(tagFilter: OverpassQueryTagFilters | OverpassQueryTagFilterFunction): ChainableOverpassStatementBase {
		console.warn("Method query has been deprecated since 1.8.0, will be removed on 2.x.x, use byTags");
		return this.byTags(tagFilter);
	}

	bbox(south: number, west: number, north: number, east: number): ChainableOverpassStatementBase;
	bbox(bbox: OverpassExpression<OverpassBoundingBox>): ChainableOverpassStatementBase;
	bbox(p1: number | OverpassExpression<OverpassBoundingBox>, ...rest: number[]): ChainableOverpassStatementBase {
		const bbox: OverpassExpression<OverpassBoundingBox> =
			typeof p1 == "number" ? ([p1, ...rest] as OverpassBoundingBox) : p1;
		return new OverpassBBoxStatement(this.target, this.chain, bbox);
	}

	byId(id: OverpassExpression<number> | OverpassExpression<number>[]): ChainableOverpassStatementBase {
		return new OverpassByIdStatement(this.target, this.chain, id);
	}

	private static PositionLiteralToGeoPosExp(
		literal: OverpassPositionLiteralExpression,
	): OverpassExpression<OverpassGeoPos> {
		return literal instanceof Array ? { lat: literal[0], lon: literal[1] } : literal;
	}

	inside(polygon: OverpassPositionLiteralExpression[]): ChainableOverpassStatementBase {
		return new OverpassInsidePolygonStatement(
			this.target,
			this.chain,
			polygon.map(OverpassTargetStateBase.PositionLiteralToGeoPosExp),
		);
	}

	filter(predicate: (e: OverpassItemEvaluatorBuilder) => OverpassEvaluator<boolean>): ChainableOverpassStatementBase {
		return new OverpassIfFilterStatement(this.target, this.chain, predicate(this.evaluatorItemBuilder));
	}

	aroundCenter(
		radius: OverpassExpression<number>,
		center: OverpassExpression<OverpassGeoPos>,
	): ChainableOverpassStatementBase {
		return new OverpassAroundCenterStatement(this.target, this.chain, radius, center);
	}

	aroundSet(radius: OverpassExpression<number>, set?: OverpassExpression<string>): ChainableOverpassStatementBase {
		return new OverpassAroundSetStatement(this.target, this.chain, radius, set);
	}

	aroundLine(
		radius: OverpassExpression<number>,
		line: OverpassPositionLiteralExpression[],
	): ChainableOverpassStatementBase {
		return new OverpassAroundLineStatement(
			this.target,
			this.chain,
			radius,
			line.map(OverpassTargetStateBase.PositionLiteralToGeoPosExp),
		);
	}

	inArea(set?: OverpassExpression<string> | undefined): ChainableOverpassStatementBase {
		return new OverpassAreaStatement(this.target, this.chain, set);
	}

	pivot(set?: OverpassExpression<string> | undefined): ChainableOverpassStatementBase {
		return new OverpassPivotStatement(this.target, this.chain, set);
	}

	recurseFrom(
		anyType: RecurseFromPrimitiveType | ParamItem<OverpassQueryTarget>,
		inSet?: OverpassExpression<string> | undefined,
		withRole?: string | undefined,
	): OverpassRecurseFilterStatementImp {
		const type = AnyTargetToQueryTarget(anyType);
		return new OverpassRecurseFilterStatementImp(this.target, this.chain, type, false, inSet, withRole);
	}

	recurseBackwards(
		anyType: OverpassQueryTargetExpression,
		inSet?: OverpassExpression<string> | undefined,
		withRole?: string | undefined,
	): OverpassRecurseFilterStatementImp {
		const type = AnyTargetToQueryTarget(anyType);
		return new OverpassRecurseFilterStatementImp(this.target, this.chain, type, true, inSet, withRole);
	}
}
