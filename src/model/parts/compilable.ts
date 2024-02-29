import { CompiledItem, CompiledOverpassBoundingBox, CompiledOverpassGeoPos } from "@/model/compilable";
import {
	OverpassOutputGeoInfo,
	OverpassOutputVerbosity,
	OverpassQueryTarget,
	OverpassRecurseStmType,
	OverpassSortOrder,
} from "@/model/enum";
import { ActualParamType, OverpassExpression, ParamItem } from "@/model/expression";
import { OverpassBoundingBox, OverpassGeoPos } from "@/model/types";

export interface CompilableItem {
	compile(utils: CompileUtils): CompiledItem;
}

export interface CompileUtils {
	readonly empty: CompiledItem;
	readonly nl: CompiledItem;

	/**
	 * @param value A string that should be sanitized
	 * @returns the prepared string without quotes
	 */
	string(value: OverpassExpression<string>): CompiledItem;
	/**
	 * @param value A string that should be sanitized
	 * @returns the prepared string with quotes included
	 */
	qString(value: OverpassExpression<string>): CompiledItem;
	/** @param value A number that should be sanitized */
	number(value: OverpassExpression<number>): CompiledItem;
	/** @param value A regexp that should be prepared */
	regExp(value: OverpassExpression<RegExp>): CompiledItem;
	date(value: OverpassExpression<Date>): CompiledItem;
	/**
	 * @param value A bbox that should be prepared
	 * @returns the respective prepared parts [s, w, n, e]
	 */
	bbox(value: OverpassExpression<OverpassBoundingBox>): CompiledOverpassBoundingBox;
	/**
	 * @param value A geo pos that should be prepared
	 * @returns the respective prepared parts { lat, lon }
	 */
	geoPos(value: OverpassExpression<OverpassGeoPos>): CompiledOverpassGeoPos;

	/** @param value A target that should be prepared */
	target(value: OverpassExpression<OverpassQueryTarget>): CompiledItem;
	/** @param value A verbosity that should be prepared */
	verbosity(value: OverpassExpression<OverpassOutputVerbosity>): CompiledItem;
	/** @param value A geoInfo that should be prepared */
	geoInfo(value: OverpassExpression<OverpassOutputGeoInfo>): CompiledItem;
	/** @param value A sortOrder that should be prepared */
	sortOrder(value: OverpassExpression<OverpassSortOrder>): CompiledItem;
	/** @param value A recurse type that should be prepared */
	recurse(value: OverpassExpression<OverpassRecurseStmType>): CompiledItem;

	isParam<T>(value: OverpassExpression<T>): value is ParamItem<T>;
	/** @returns wheter {@link value} is a {@link ParamItem<T>} and it's type is {@link type} */
	isSpecificParam<T>(value: OverpassExpression<any>, type: ActualParamType<T>): value is ParamItem<T>;

	/** A string that should ve used as is */
	raw(string: string): CompiledItem;
	/** Join several expressions into one */
	join(expressions: CompiledItem[], separator: string): CompiledItem;
	/**
	 * Build an item with a template using other expressions
	 * @example
	 * 	u.template`node(${u.number(id)})`
	 */
	template(strings: TemplateStringsArray, ...expr: CompiledItem[]): CompiledItem;
}
