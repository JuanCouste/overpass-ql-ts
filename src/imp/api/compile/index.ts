import { OverpassParamCompiledItem } from "@/imp/api/compile/param";
import { OverpassParentCompiledItem } from "@/imp/api/compile/parent";
import { enumObjectToArray } from "@/imp/api/enum";
import {
	ActualParamType,
	CompileUtils,
	CompiledItem,
	CompiledOverpassBoundingBox,
	CompiledOverpassGeoPos,
	OverpassBoundingBox,
	OverpassExpression,
	OverpassGeoPos,
	OverpassParameterError,
	OverpassQueryTarget,
	ParamItem,
	ParamType,
	ParentCompiledItem,
} from "@/model";

const OP_TARGETS_STRING: string[] = enumObjectToArray<OverpassQueryTarget, string>({
	[OverpassQueryTarget.Node]: "node",
	[OverpassQueryTarget.Way]: "way",
	[OverpassQueryTarget.NodeWay]: "nw",
	[OverpassQueryTarget.Relation]: "rel",
	[OverpassQueryTarget.NodeRelation]: "nr",
	[OverpassQueryTarget.WayRelation]: "wr",
	[OverpassQueryTarget.NodeWayRelation]: "nwr",
	[OverpassQueryTarget.Area]: "area",
	[OverpassQueryTarget.Derived]: "derived",
});

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

	target(value: OverpassExpression<OverpassQueryTarget>): CompiledItem {
		return this.paramItem(value, (target) => {
			if (!this.isNumber(target)) {
				throw new OverpassParameterError(`Unexpected target value (${target})`);
			}

			if (!(target in OverpassQueryTarget)) {
				throw new OverpassParameterError(`Unexpected target value (${target})`);
			}

			return this.raw(OP_TARGETS_STRING[target]);
		});
	}

	regExp(value: OverpassExpression<RegExp>): CompiledItem {
		return this.paramItem(value, (regExp) => {
			if (!(regExp instanceof RegExp)) {
				throw new OverpassParameterError(`Unexpected RegExp value (${regExp})`);
			}

			return this.template`"${this.raw(regExp.source)}"`;
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

	template(strings: TemplateStringsArray, ...expr: CompiledItem[]): ParentCompiledItem {
		return new OverpassParentCompiledItem(
			strings.raw
				.map((part, i) => [part, expr[i]])
				.flat()
				.slice(0, -1),
		);
	}
}
