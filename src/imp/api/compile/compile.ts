import { enumObjectToArray } from "@/imp/api/enum";
import {
	ActualParamType,
	CompileUtils,
	CompiledItem,
	CompiledOverpassBoundingBox,
	CompiledOverpassGeoPos,
	EnumParamType,
	OverpassBoundingBox,
	OverpassEnum,
	OverpassExpression,
	OverpassGeoPos,
	OverpassOutputGeoInfo,
	OverpassOutputVerbosity,
	OverpassParameterError,
	OverpassQueryTarget,
	OverpassRecurseStmType,
	OverpassSortOrder,
	ParamItem,
	ParamType,
} from "@/model";
import { OverpassParamCompiledItem } from "./param";
import { OverpassParentCompiledItem } from "./parent";

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

const BBOX_SEED: OverpassBoundingBox = [0, 0, 0, 0];

const DIRECTIONS = ["south", "west", "north", "east"];

enum Axis {
	Lat,
	Lon,
}

const AXIS_RANGE: { [K in Axis]: number } = { [Axis.Lat]: 90, [Axis.Lon]: 180 };

export class OverpassCompileUtils implements CompileUtils {
	public readonly nl: CompiledItem;
	public readonly empty: CompiledItem;

	constructor() {
		this.nl = this.raw("\n");
		this.empty = this.raw("");
	}

	private paramItem<T>(value: OverpassExpression<T>, callback: (item: T) => CompiledItem) {
		if (this.isParam(value)) {
			return new OverpassParamCompiledItem<T>(value, callback);
		} else {
			return callback(value);
		}
	}

	string(value: OverpassExpression<string>): CompiledItem {
		return this.paramItem(value, (string) => {
			if (typeof string != "string") {
				throw new OverpassParameterError(`Unexpected string value (${string})`);
			}

			return this.raw(string);
		});
	}

	qString(value: OverpassExpression<string>): CompiledItem {
		return this.paramItem(value, (string) => {
			if (typeof string != "string") {
				throw new OverpassParameterError(`Unexpected string value (${string})`);
			}

			return this.template`"${this.raw(string)}"`;
		});
	}

	private isNumber(number: number): boolean {
		return typeof number == "number" && !isNaN(number) && isFinite(number);
	}

	number(value: OverpassExpression<number>): CompiledItem {
		return this.paramItem(value, (number) => {
			if (!this.isNumber(number)) {
				throw new OverpassParameterError(`Unexpected number value (${number})`);
			}

			return this.raw(number.toString());
		});
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

	private enum<T extends OverpassEnum>(type: EnumParamType, value: OverpassExpression<T>): CompiledItem {
		return this.paramItem(value, (enumValue) => {
			if (!this.isNumber(enumValue)) {
				throw new OverpassParameterError(`Unexpected target value (${enumValue})`);
			}

			const enumObject = this.getEnumObject(type);

			if (!(enumValue in enumObject)) {
				throw new OverpassParameterError(`Unexpected ${ParamType[type]} value (${enumValue})`);
			}

			return this.raw(ENUM_STRINGS[type][enumValue]);
		});
	}

	target(value: OverpassExpression<OverpassQueryTarget>): CompiledItem {
		return this.enum(ParamType.Target, value);
	}

	geoInfo(value: OverpassExpression<OverpassOutputGeoInfo>): CompiledItem {
		return this.enum(ParamType.GeoInfo, value);
	}

	sortOrder(value: OverpassExpression<OverpassSortOrder>): CompiledItem {
		return this.enum(ParamType.SortOrder, value);
	}

	verbosity(value: OverpassExpression<OverpassOutputVerbosity>): CompiledItem {
		return this.enum(ParamType.Verbosity, value);
	}

	recurse(value: OverpassExpression<OverpassRecurseStmType>): CompiledItem {
		return this.enum(ParamType.RecurseStm, value);
	}

	regExp(value: OverpassExpression<RegExp>): CompiledItem {
		return this.paramItem(value, (regExp) => {
			if (!(regExp instanceof RegExp)) {
				throw new OverpassParameterError(`Unexpected RegExp value (${regExp})`);
			}

			return this.template`"${this.raw(regExp.source)}"`;
		});
	}

	date(value: OverpassExpression<Date>): CompiledItem {
		return this.paramItem(value, (date) => {
			if (!(date instanceof Date)) {
				throw new OverpassParameterError(`Unexpected Date value (${date})`);
			}

			if (isNaN(date.getTime())) {
				throw new OverpassParameterError(`Invalid date (${date.getTime()})`);
			}

			return this.raw(date.toISOString());
		});
	}

	private isOutOfRange(number: number, axis: Axis): boolean {
		return Math.abs(number) > AXIS_RANGE[axis];
	}

	bbox(bboxExp: OverpassExpression<OverpassBoundingBox>): CompiledOverpassBoundingBox {
		const bbox = BBOX_SEED.map((_, dirIndex) =>
			this.paramItem(bboxExp, (bbox) => {
				if (bbox == null) {
					throw new OverpassParameterError(`Unexpected BoundingBox value (${bbox})`);
				}

				const value = bbox[dirIndex];

				if (this.isOutOfRange(value, dirIndex % 2 == 0 ? Axis.Lat : Axis.Lon)) {
					throw new OverpassParameterError(`BoundingBox ${DIRECTIONS[dirIndex]} out of range (${value})`);
				}

				return this.number(value);
			}),
		);

		return bbox as CompiledOverpassBoundingBox;
	}

	private geoPosCoord(geoPosExp: OverpassExpression<OverpassGeoPos>, coord: keyof OverpassGeoPos): CompiledItem {
		return this.paramItem(geoPosExp, (geoPos) => {
			if (geoPos == null) {
				throw new OverpassParameterError(`Unexpected GeoPos value (${geoPos})`);
			}

			const value = geoPos[coord];

			if (this.isOutOfRange(value, coord == "lat" ? Axis.Lat : Axis.Lon)) {
				throw new OverpassParameterError(`GeoPos ${coord} out of range (${value})`);
			}

			return this.number(value);
		});
	}

	geoPos(value: OverpassExpression<OverpassGeoPos>): CompiledOverpassGeoPos {
		return {
			lat: this.geoPosCoord(value, "lat"),
			lon: this.geoPosCoord(value, "lon"),
		};
	}

	isParam<T>(value: OverpassExpression<T>): value is ParamItem<T> {
		if (typeof value == "object") {
			return value != null && "type" in value && value.type in ParamType;
		} else {
			return false;
		}
	}

	isSpecificParam<T>(value: any, type: ActualParamType<T>): value is ParamItem<T> {
		return this.isParam(value) && value.type == type;
	}

	raw(string: string): CompiledItem {
		return new OverpassParentCompiledItem([string]);
	}

	join(expressions: CompiledItem[], separator: string): CompiledItem {
		return new OverpassParentCompiledItem(
			expressions
				.map((part) => [part, separator])
				.flat()
				.slice(0, -1),
		);
	}

	template(strings: TemplateStringsArray, ...expr: CompiledItem[]): CompiledItem {
		return new OverpassParentCompiledItem(
			strings.raw
				.map((part, i) => [part, expr[i]])
				.flat()
				.slice(0, -1),
		);
	}
}
