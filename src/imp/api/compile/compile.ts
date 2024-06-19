import {
	CompileUtils,
	CompiledItem,
	CompiledOverpassBoundingBox,
	CompiledOverpassGeoPos,
	OverpassBoundingBox,
	OverpassExpression,
	OverpassGeoPos,
	OverpassOutputGeoInfo,
	OverpassOutputVerbosity,
	OverpassQueryTarget,
	OverpassRecurseStmType,
	OverpassSortOrder,
	OverpassStringSanitizer,
	ParamType,
} from "@/model";
import {
	BBoxParamCompiledItem,
	BooleanParamCompiledItem,
	DateParamCompiledItem,
	EnumParamCompiledItem,
	GeoPosParamCompiledItem,
	NumberParamCompiledItem,
	RegExpParamCompiledItem,
	SetParamCompiledItem,
	StringParamCompiledItem,
} from "./param";
import { ParentCompiledItem } from "./parent";

export class OverpassCompileUtils implements CompileUtils {
	public readonly nl: CompiledItem<string>;

	constructor(private readonly sanitizer: OverpassStringSanitizer) {
		this.nl = this.raw("\n");
	}

	qString(value: OverpassExpression<string>): CompiledItem<string> {
		return new StringParamCompiledItem(this.sanitizer, value);
	}

	number(value: OverpassExpression<number>): CompiledItem<number> {
		return new NumberParamCompiledItem(value);
	}

	set(value: OverpassExpression<string>): CompiledItem<string> {
		return new SetParamCompiledItem(value);
	}

	target(value: OverpassExpression<OverpassQueryTarget>): CompiledItem<OverpassQueryTarget> {
		return new EnumParamCompiledItem(ParamType.Target, value);
	}

	geoInfo(value: OverpassExpression<OverpassOutputGeoInfo>): CompiledItem<OverpassOutputGeoInfo> {
		return new EnumParamCompiledItem(ParamType.GeoInfo, value);
	}

	sortOrder(value: OverpassExpression<OverpassSortOrder>): CompiledItem<OverpassSortOrder> {
		return new EnumParamCompiledItem(ParamType.SortOrder, value);
	}

	verbosity(value: OverpassExpression<OverpassOutputVerbosity>): CompiledItem<OverpassOutputVerbosity> {
		return new EnumParamCompiledItem(ParamType.Verbosity, value);
	}

	recurse(value: OverpassExpression<OverpassRecurseStmType>): CompiledItem<OverpassRecurseStmType> {
		return new EnumParamCompiledItem(ParamType.RecurseStm, value);
	}

	regExp(value: OverpassExpression<RegExp>): CompiledItem<RegExp> {
		return new RegExpParamCompiledItem(value);
	}

	date(value: OverpassExpression<Date>): CompiledItem<Date> {
		return new DateParamCompiledItem(value);
	}

	bbox(bboxExp: OverpassExpression<OverpassBoundingBox>): CompiledOverpassBoundingBox {
		return BBoxParamCompiledItem.BBox(bboxExp);
	}

	geoPos(value: OverpassExpression<OverpassGeoPos>): CompiledOverpassGeoPos {
		return GeoPosParamCompiledItem.GeoPos(value);
	}

	boolean(value: OverpassExpression<boolean>): CompiledItem<boolean> {
		return new BooleanParamCompiledItem(value);
	}

	raw(string: string): CompiledItem<string> {
		return new ParentCompiledItem([string]);
	}

	join(expressions: CompiledItem<any>[], separator: string): CompiledItem<string> {
		return new ParentCompiledItem(
			expressions
				.map((part) => [part, separator])
				.flat()
				.slice(0, -1),
		);
	}

	template(strings: TemplateStringsArray, ...expr: CompiledItem<any>[]): CompiledItem<string> {
		return new ParentCompiledItem(
			strings.raw
				.map((part, i) => [part, expr[i]])
				.flat()
				.slice(0, -1),
		);
	}
}
