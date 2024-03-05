import {
	OverpassOutputGeoInfo,
	OverpassOutputVerbosity,
	OverpassQueryTarget,
	OverpassRecurseStmType,
	OverpassSortOrder,
} from "./enum";
import { OverpassBoundingBox, OverpassGeoPos } from "./types";

export enum ParamType {
	Number,
	String,
	RegExp,
	BoundingBox,
	GeoPos,
	Date,
	Boolean,
	Target,
	Verbosity,
	GeoInfo,
	SortOrder,
	RecurseStm,
}

export type EnumParamType =
	| ParamType.Target
	| ParamType.Verbosity
	| ParamType.GeoInfo
	| ParamType.SortOrder
	| ParamType.RecurseStm;

export type OverpassEnum =
	| OverpassQueryTarget
	| OverpassOutputVerbosity
	| OverpassOutputGeoInfo
	| OverpassSortOrder
	| OverpassRecurseStmType;

export type AnyParamValue =
	| number
	| boolean
	| OverpassEnum
	| string
	| RegExp
	| Date
	| OverpassBoundingBox
	| OverpassGeoPos;

export type ActualEnumParamType<T extends OverpassEnum> = T extends OverpassQueryTarget
	? ParamType.Target
	: T extends OverpassOutputVerbosity
		? ParamType.Verbosity
		: T extends OverpassOutputGeoInfo
			? ParamType.GeoInfo
			: T extends OverpassSortOrder
				? ParamType.SortOrder
				: T extends OverpassRecurseStmType
					? ParamType.RecurseStm
					: never;

export type ActualParamType<T> = T extends OverpassEnum
	? ActualEnumParamType<T> | ParamType.Number
	: T extends number
		? ParamType.Number
		: T extends boolean
			? ParamType.Boolean
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
