import {
	ChainableOverpassStatementBase,
	OverpassBBoxStatement,
	OverpassByIdStatement,
	OverpassByTagsStatement,
	OverpassIfFilterStatement,
	OverpassInsidePolygonStatement,
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
	OverpassStatementTarget,
	OverpassTagFilter,
	OverpassTagFilterBuilder,
	OverpassTagFilterHelper,
	OverpassTargetState,
	ParamType,
} from "@/model";

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
		return prop instanceof RegExp || this.utils.isSpecificParam<RegExp>(prop, ParamType.RegExp);
	}

	private anyFilterToHelper(anyTag: AnyOverpassTagFilter): OverpassTagFilterHelper {
		if (anyTag == null) {
			throw new OverpassParameterError(`Unexpected query filter value null`);
		} else if (typeof anyTag == "string" || this.utils.isSpecificParam<string>(anyTag, ParamType.String)) {
			return this.tagBuilder.equals(anyTag);
		} else if (anyTag instanceof RegExp || this.utils.isSpecificParam<RegExp>(anyTag, ParamType.RegExp)) {
			return this.tagBuilder.regExp(anyTag);
		} else {
			return anyTag;
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

	byId(id: OverpassExpression<number>): ChainableOverpassStatementBase {
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
}
