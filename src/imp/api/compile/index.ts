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

export class OverpassCompileUtils implements CompileUtils {
	public readonly nl: CompiledItem;
	public readonly empty: CompiledItem;

	constructor() {
		this.nl = this.raw("\n");
		this.empty = this.raw("");
	}

	private paramItem<T>(param: ParamItem<T>, callback: (item: T) => CompiledItem): CompiledItem {
		return new OverpassParamCompiledItem<T>(param, callback);
	}

	string(value: OverpassExpression<string>): CompiledItem {
		if (this.isParam(value)) {
			return this.paramItem(value, (string) => this.raw(string));
		} else {
			return this.raw(value);
		}
	}

	number(value: OverpassExpression<number>): CompiledItem {
		if (this.isParam(value)) {
			return this.paramItem(value, (number) => this.rawNumber(number));
		} else {
			return this.rawNumber(value);
		}
	}

	target(value: OverpassExpression<OverpassQueryTarget>): CompiledItem {
		if (this.isParam(value)) {
			return this.paramItem(value, (target) => this.raw(OP_TARGETS_STRING[target]));
		} else {
			return this.raw(OP_TARGETS_STRING[value]);
		}
	}

	regExp(value: OverpassExpression<RegExp>): CompiledItem {
		if (this.isParam(value)) {
			return this.paramItem(value, (regExp) => this.raw(regExp.source));
		} else {
			return this.raw(value.source);
		}
	}

	bbox(value: OverpassExpression<OverpassBoundingBox>): CompiledOverpassBoundingBox {
		if (this.isParam(value)) {
			const seed: OverpassBoundingBox = [0, 0, 0, 0];
			const coords = seed.map((_, i) => this.paramItem(value, (bbox) => this.rawNumber(bbox[i])));
			return coords as CompiledOverpassBoundingBox;
		} else {
			return value.map((coord) => this.rawNumber(coord)) as CompiledOverpassBoundingBox;
		}
	}

	geoPos(value: OverpassExpression<OverpassGeoPos>): CompiledOverpassGeoPos {
		if (this.isParam(value)) {
			return {
				lat: this.paramItem(value, ({ lat }) => this.rawNumber(lat)),
				lon: this.paramItem(value, ({ lon }) => this.rawNumber(lon)),
			};
		} else {
			const { lat, lon } = value;
			return { lat: this.rawNumber(lat), lon: this.rawNumber(lon) };
		}
	}

	isParam<T>(value: OverpassExpression<T>): value is ParamItem<T> {
		if (typeof value == "object") {
			return "type" in value! && value.type in ParamType;
		} else {
			return false;
		}
	}

	isSpecificParam<T>(value: any, type: ActualParamType<T>): value is ParamItem<T> {
		return this.isParam(value) && value.type == type;
	}

	private rawNumber(number: number): CompiledItem {
		return this.raw(number.toString());
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
