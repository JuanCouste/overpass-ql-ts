import { OverpassQueryTarget } from "@/model/enum";
import { OverpassNodeString, OverpassRelationString, OverpassWayString } from "./target";

export type RecurseFromPrimitiveType =
	| OverpassWayString
	| OverpassQueryTarget.Way
	| OverpassRelationString
	| OverpassQueryTarget.Relation;

export type RecurseToPrimitiveType =
	| OverpassNodeString
	| OverpassQueryTarget.Node
	| OverpassWayString
	| OverpassQueryTarget.Way;
