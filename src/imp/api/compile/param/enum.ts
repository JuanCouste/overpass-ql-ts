import { enumObjectToArray } from "@/imp/api/enum";
import {
	ActualEnumParamType,
	EnumParamType,
	OverpassEnum,
	OverpassExpression,
	OverpassOutputGeoInfo,
	OverpassOutputVerbosity,
	OverpassParameterError,
	OverpassQueryTarget,
	OverpassRecurseStmType,
	OverpassSortOrder,
	ParamType,
} from "@/model";
import { BaseParamCompiledItem } from "./base";
import { isValidNumber } from "./utils";

const ENUM_STRINGS: { [K in EnumParamType]: string[] } = {
	[ParamType.Target]: enumObjectToArray<OverpassQueryTarget, string>({
		[OverpassQueryTarget.Node]: "node",
		[OverpassQueryTarget.Way]: "way",
		[OverpassQueryTarget.NodeWay]: "nw",
		[OverpassQueryTarget.Relation]: "rel",
		[OverpassQueryTarget.NodeRelation]: "nr",
		[OverpassQueryTarget.WayRelation]: "wr",
		[OverpassQueryTarget.NodeWayRelation]: "nwr",
		[OverpassQueryTarget.Area]: "area",
		[OverpassQueryTarget.Derived]: "derived",
	}),

	[ParamType.Verbosity]: enumObjectToArray<OverpassOutputVerbosity, string>({
		[OverpassOutputVerbosity.Ids]: "ids",
		[OverpassOutputVerbosity.Geometry]: "skel",
		[OverpassOutputVerbosity.Body]: "body",
		[OverpassOutputVerbosity.Tags]: "tags",
		[OverpassOutputVerbosity.Metadata]: "meta",
	}),

	[ParamType.GeoInfo]: enumObjectToArray<OverpassOutputGeoInfo, string>({
		[OverpassOutputGeoInfo.Geometry]: "geom",
		[OverpassOutputGeoInfo.BoundingBox]: "bb",
		[OverpassOutputGeoInfo.Center]: "center",
	}),

	[ParamType.SortOrder]: enumObjectToArray<OverpassSortOrder, string>({
		[OverpassSortOrder.Ascending]: "asc",
		[OverpassSortOrder.QuadtileIndex]: "qt",
	}),

	[ParamType.RecurseStm]: enumObjectToArray<OverpassRecurseStmType, string>({
		[OverpassRecurseStmType.Up]: "<",
		[OverpassRecurseStmType.Down]: ">",
		[OverpassRecurseStmType.UpRelations]: "<<",
		[OverpassRecurseStmType.DownRelations]: ">>",
	}),
};

export class EnumParamCompiledItem<T extends OverpassEnum> extends BaseParamCompiledItem<T, T> {
	constructor(private readonly type: ActualEnumParamType<T>, value: OverpassExpression<T>) {
		super(value);
	}

	private getEnumObject(type: EnumParamType) {
		switch (type) {
			case ParamType.Target:
				return OverpassQueryTarget;
			case ParamType.Verbosity:
				return OverpassOutputVerbosity;
			case ParamType.GeoInfo:
				return OverpassOutputGeoInfo;
			case ParamType.SortOrder:
				return OverpassSortOrder;
			case ParamType.RecurseStm:
				return OverpassRecurseStmType;
		}
	}

	protected validateParam(param: T): T {
		if (!isValidNumber(param)) {
			throw new OverpassParameterError(`Unexpected target value (${param})`);
		}

		const enumObject = this.getEnumObject(this.type);

		if (!(param in enumObject)) {
			throw new OverpassParameterError(`Unexpected Enum value (${enumObject[param]})`);
		}

		return param;
	}

	protected compilePram(param: T): string {
		return ENUM_STRINGS[this.type][param];
	}
}
