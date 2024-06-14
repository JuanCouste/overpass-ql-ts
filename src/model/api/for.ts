import { OverpassExpression } from "@/model/expression";
import { OverpassStatement } from "@/model/parts";

export interface OverpassForEachItem {
	readonly name: OverpassExpression<string>;
}

export type OverpassForEachBodyFunction = (item: OverpassForEachItem) => OverpassStatement[] | OverpassStatement;
