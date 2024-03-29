import { ComposableOverpassStatement, OverpassExpression } from "@/model";
import { OverpassTargetState } from "@/query";
import { OverpassTargetStateBase } from "./base";
import { OverpassChainableIntersectStatement } from "./intersect";

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
