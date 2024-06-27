import {
	OverpassExpression,
	OverpassQueryTarget,
	OverpassQueryTargetExpression,
	OverpassQueryTargetString,
} from "@/model";

export const TARGETS: { [K in OverpassQueryTargetString]: OverpassQueryTarget } = {
	node: OverpassQueryTarget.Node,
	way: OverpassQueryTarget.Way,
	relation: OverpassQueryTarget.Relation,
	any: OverpassQueryTarget.NodeWayRelation,
};

export function AnyTargetToQueryTarget(
	anyTarget: OverpassQueryTargetExpression,
): OverpassExpression<OverpassQueryTarget> {
	return typeof anyTarget == "string" ? TARGETS[anyTarget] : anyTarget;
}
