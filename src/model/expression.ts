import { OverpassBoundingBox, OverpassGeoPos, OverpassQueryTarget } from "@/model/types";

export enum ParamType {
	Number,
	String,
	RegExp,
	BoundingBox,
	GeoPos,
	Target,
	Date,
}

export type AnyParamValue =
	| number
	| OverpassQueryTarget
	| string
	| RegExp
	| Date
	| OverpassBoundingBox
	| OverpassGeoPos;

export type ActualParamType<T> = T extends OverpassQueryTarget
	? ParamType.Target | ParamType.Number
	: T extends number
	? ParamType.Number
	: T extends string
	? ParamType.String
	: T extends RegExp
	? ParamType.RegExp
	: T extends Date
	? ParamType.Date
	: T extends OverpassBoundingBox
	? ParamType.BoundingBox
	: T extends OverpassGeoPos
	? ParamType.GeoPos
	: never;

export interface ParamItem<T> {
	readonly index: number;
	readonly type: ActualParamType<T>;
}

export type OverpassExpression<T> = T | ParamItem<T>;
