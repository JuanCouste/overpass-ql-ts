import { OverpassExpression } from "@/model/expression";
import { OverpassTagFilter } from "@/model/parts";

export interface OverpassTagFilterHelper {
	complete(prop: OverpassExpression<string | RegExp>): OverpassTagFilter;

	not(): OverpassTagFilterHelper;
}

export interface OverpassTagFilterBuilder {
	readonly not: OverpassTagFilterBuilder;

	/** Prop is exactly {@link value} */
	equals(value: OverpassExpression<string>): OverpassTagFilterHelper;

	/** Prop is defined on the element */
	exists(): OverpassTagFilterHelper;

	/** Prop satisfies the following RegExp */
	regExp(exp: OverpassExpression<RegExp>): OverpassTagFilterHelper;
}

export type AnyOverpassTagFilter =
	| OverpassExpression<string> /** Prop is exactly this */
	| OverpassExpression<RegExp> /** Prop satisfies the following this */
	| OverpassTagFilterHelper /** Any tag filter */;

/**
 * An object representing the restrictions to be applied to a key
 * ie: { name: "Hello World" } => [name="Hello World"]
 * ie: { name: [/^Hello/, /World$/] } => [name~"^Hello"][name~"World$"]
 */
export type OverpassQueryTagFitlerObject = Record<string, AnyOverpassTagFilter | AnyOverpassTagFilter[]>;

/**
 * A single regexp restriction to be aplied to some key
 * ie: [/^na.e$/, /^He.*ld$/] => [~"^na.e$"~"^He.*ld$"]
 */
export type OverpassQueryRegExpTagFilterTuple = [OverpassExpression<RegExp>, OverpassExpression<RegExp>];

export type OverpassQueryTagFilterTuple =
	| [OverpassExpression<string>, AnyOverpassTagFilter]
	/** A regular expression for a key can only be combined with a regular expression as value criterion */
	| OverpassQueryRegExpTagFilterTuple;

export type OverpassQueryTagFilters = OverpassQueryTagFitlerObject | OverpassQueryTagFilterTuple[];

/** Helper function to build special filters */
export type OverpassQueryTagFilterFunction = (builder: OverpassTagFilterBuilder) => OverpassQueryTagFilters;
