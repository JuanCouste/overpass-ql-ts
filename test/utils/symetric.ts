import {
	ActualParamType,
	AnyParamValue,
	EnumParamType,
	OverpassBoundingBox,
	OverpassEnum,
	OverpassExpression,
	OverpassGeoPos,
	ParamType,
} from "@/index";

export interface SymetricArgumentObject<T> {
	readonly exp: OverpassExpression<T>;
	readonly type: ActualParamType<T>;
}

export type SymetricArgsExpression<Args extends AnyParamValue[]> = { [K in keyof Args]: OverpassExpression<Args[K]> };

export type SymetricArgumentsObject<Args extends AnyParamValue[]> = {
	[K in keyof Args]: SymetricArgumentObject<Args[K]>;
};

export const Symetric = {
	Number(exp: number): SymetricArgumentObject<number> {
		return { exp, type: ParamType.Number };
	},

	Bool(exp: boolean): SymetricArgumentObject<boolean> {
		return { exp, type: ParamType.Boolean };
	},

	String(exp: string): SymetricArgumentObject<string> {
		return { exp, type: ParamType.String };
	},

	RegExp(exp: RegExp): SymetricArgumentObject<RegExp> {
		return { exp, type: ParamType.RegExp };
	},

	Date(exp: Date): SymetricArgumentObject<Date> {
		return { exp, type: ParamType.Date };
	},

	BBox(exp: OverpassBoundingBox): SymetricArgumentObject<OverpassBoundingBox> {
		return { exp, type: ParamType.BoundingBox };
	},

	GeoPos(exp: OverpassGeoPos): SymetricArgumentObject<OverpassGeoPos> {
		return { exp, type: ParamType.GeoPos };
	},

	Enum<T extends OverpassEnum>(type: EnumParamType, exp: T): SymetricArgumentObject<T> {
		return { exp, type: type as ActualParamType<T> };
	},
};
