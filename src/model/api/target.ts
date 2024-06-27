import { OverpassQueryTarget } from "@/model/enum";
import { OverpassExpression } from "@/model/expression";
import { OverpassGeoPos } from "@/model/types";

export type OverpassAnyString = "any";
export type OverpassNodeString = "node";
export type OverpassWayString = "way";
export type OverpassRelationString = "relation";

export type OverpassQueryTargetString =
	| OverpassAnyString
	| OverpassNodeString
	| OverpassWayString
	| OverpassRelationString;

export type AnyOverpassQueryTarget = OverpassQueryTarget | OverpassQueryTargetString;

export type OverpassPositionLiteralExpression = [number, number] | OverpassExpression<OverpassGeoPos>;

export type OverpassQueryTargetExpression = AnyOverpassQueryTarget | OverpassExpression<OverpassQueryTarget>;
