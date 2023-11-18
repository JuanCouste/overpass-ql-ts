import { ActualParamType, OverpassExpression, ParamItem } from "@/model/expression";
import { OverpassBoundingBox, OverpassGeoPos, OverpassQueryTarget } from "@/model/types";

export interface BaseCompiledItem {
	readonly isParam: boolean;
}

export interface ParamCompiledItem<T> extends BaseCompiledItem {
	readonly isParam: true;
	readonly index: number;

	compile(param: T): string;
}

export type CompiledSubPart = string | ParamCompiledItem<any>;

export interface ParentCompiledItem extends BaseCompiledItem {
	readonly isParam: false;
	readonly subParts: CompiledSubPart[];
}

export type CompiledItem = ParamCompiledItem<any> | ParentCompiledItem;

export type CompiledOverpassBoundingBox = [
	south: CompiledItem,
	west: CompiledItem,
	north: CompiledItem,
	east: CompiledItem,
];

export interface CompiledOverpassGeoPos {
	readonly lat: CompiledItem;
	readonly lon: CompiledItem;
}

export interface CompileUtils {
	readonly empty: CompiledItem;
	readonly nl: CompiledItem;

	string(value: OverpassExpression<string>): CompiledItem;
	number(value: OverpassExpression<number>): CompiledItem;
	regExp(value: OverpassExpression<RegExp>): CompiledItem;
	bbox(value: OverpassExpression<OverpassBoundingBox>): CompiledOverpassBoundingBox;
	geoPos(value: OverpassExpression<OverpassGeoPos>): CompiledOverpassGeoPos;
	target(value: OverpassExpression<OverpassQueryTarget>): CompiledItem;

	isParam<T>(value: OverpassExpression<T>): value is ParamItem<T>;
	isSpecificParam<T>(value: OverpassExpression<any>, type: ActualParamType<T>): value is ParamItem<T>;

	raw(string: string): CompiledItem;
	join(expressions: CompiledItem[], separator: string): CompiledItem;
	template(strings: TemplateStringsArray, ...expr: CompiledItem[]): ParentCompiledItem;
}

export interface CompilableItem {
	compile(utils: CompileUtils): CompiledItem;
}
