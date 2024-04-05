import { OverpassExpression } from "@/model/expression";
import { OverpassFilter } from "@/model/parts";

export interface OverpassFilterHelper {
	complete(prop: OverpassExpression<string | RegExp>): OverpassFilter;

	not(): OverpassFilterHelper;
}

export interface OverpassFilterBuilder {
	readonly not: OverpassFilterBuilder;

	/** Prop is exactly {@link value} */
	equals(value: OverpassExpression<string>): OverpassFilterHelper;

	/** Prop is defined on the element */
	exists(): OverpassFilterHelper;

	/** Prop satisfies the following RegExp */
	regExp(exp: OverpassExpression<RegExp>): OverpassFilterHelper;
}

export type AnyOverpassFilter =
	| OverpassExpression<string> /** Prop is exactly this */
	| OverpassExpression<RegExp> /** Prop satisfies the following this */
	| OverpassFilterHelper /** Any filter */;

/**
 * An object representing the restrictions to be applied to a key
 * ie: { name: "Hello World" } => [name="Hello World"]
 * ie: { name: [/^Hello/, /World$/] } => [name~"^Hello"][name~"World$"]
 */
export type OverpassQueryFilterObject = Record<string, AnyOverpassFilter | AnyOverpassFilter[]>;

/**
 * A single regexp restriction to be aplied to some key
 * ie: [/^na.e$/, /^He.*ld$/] => [~"^na.e$"~"^He.*ld$"]
 */
export type OverpassQueryRegExpFilterTuple = [OverpassExpression<RegExp>, OverpassExpression<RegExp>];

export type OverpassQueryFilterTuple =
	| [OverpassExpression<string>, AnyOverpassFilter]
	/** A regular expression for a key can only be combined with a regular expression as value criterion */
	| OverpassQueryRegExpFilterTuple;

export type OverpassQueryFilter = OverpassQueryFilterObject | OverpassQueryFilterTuple[];

/** Helper function to build special filters */
export type OverpassQueryFilterFunction = (builder: OverpassFilterBuilder) => OverpassQueryFilter;
