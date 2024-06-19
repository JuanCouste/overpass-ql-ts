import { CompiledItem, CompiledOverpassBoundingBox, CompiledOverpassGeoPos } from "@/model/compilable";
import {
	OverpassOutputGeoInfo,
	OverpassOutputVerbosity,
	OverpassQueryTarget,
	OverpassRecurseStmType,
	OverpassSortOrder,
} from "@/model/enum";
import { OverpassExpression } from "@/model/expression";
import { OverpassBoundingBox, OverpassGeoPos } from "@/model/types";

export interface CompilableItem {
	compile(utils: CompileUtils): CompiledItem<string>;
}

export interface CompileUtils {
	readonly nl: CompiledItem<string>;

	/**
	 * @param value A string that should be sanitized
	 * @returns the prepared string with quotes included
	 */
	qString(value: OverpassExpression<string>): CompiledItem<string>;
	/** @param value A number that should be sanitized */
	number(value: OverpassExpression<number>): CompiledItem<number>;
	/** @param value A regexp that should be prepared */
	regExp(value: OverpassExpression<RegExp>): CompiledItem<RegExp>;
	date(value: OverpassExpression<Date>): CompiledItem<Date>;
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
	/** @param value A set name */
	set(value: OverpassExpression<string>): CompiledItem<string>;

	/** @param value A boolean value for use inside an evaluator */
	boolean(value: OverpassExpression<boolean>): CompiledItem<boolean>;

	/** @param value A target that should be prepared */
	target(value: OverpassExpression<OverpassQueryTarget>): CompiledItem<OverpassQueryTarget>;
	/** @param value A verbosity that should be prepared */
	verbosity(value: OverpassExpression<OverpassOutputVerbosity>): CompiledItem<OverpassOutputVerbosity>;
	/** @param value A geoInfo that should be prepared */
	geoInfo(value: OverpassExpression<OverpassOutputGeoInfo>): CompiledItem<OverpassOutputGeoInfo>;
	/** @param value A sortOrder that should be prepared */
	sortOrder(value: OverpassExpression<OverpassSortOrder>): CompiledItem<OverpassSortOrder>;
	/** @param value A recurse type that should be prepared */
	recurse(value: OverpassExpression<OverpassRecurseStmType>): CompiledItem<OverpassRecurseStmType>;

	/** A string that should ve used as is */
	raw(string: string): CompiledItem<string>;
	/** Join several expressions into one */
	join(expressions: CompiledItem<any>[], separator: string): CompiledItem<string>;
	/**
	 * Build an item with a template using other expressions
	 * @example
	 * 	u.template`node(${u.number(id)})`
	 */
	template(strings: TemplateStringsArray, ...expr: CompiledItem<any>[]): CompiledItem<string>;
}

export type CompileFunction = (utils: CompileUtils) => CompiledItem<any>;
