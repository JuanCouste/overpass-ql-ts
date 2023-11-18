import { OverpassTargetStateBase } from "@/imp/api/target/base";
import { OverpassChainableIntersectStatement } from "@/imp/api/target/intersect";
import { ComposableOverpassStatement, OverpassExpression } from "@/model";
import { OverpassTargetState } from "@/query";

export class OverpassTargetMapStateImp extends OverpassTargetStateBase {
	intersect(
		set1: OverpassExpression<string>,
		...sets: OverpassExpression<string>[]
	): ComposableOverpassStatement & OverpassTargetState {
		return new OverpassChainableIntersectStatement(
			this.target.withIntersection(set1, ...sets),
			this.utils,
			this.filterBuilder,
		);
	}
}
