import { OverpassQueryTarget, OverpassRecurseStmType } from "@/model/enum";
import { OverpassExpression, ParamItem } from "@/model/expression";
import {
	ChainableOverpassStatement,
	CompileFunction,
	ComposableOverpassStatement,
	OverpassEvaluator,
	OverpassStatement,
} from "@/model/parts";
import { OverpassOutputOptions } from "@/model/query";
import { OverpassBoundingBox, OverpassGeoPos } from "@/model/types";
import { OverpassItemEvaluatorBuilder } from "./evaluator";
import { OverpassForEachBodyFunction } from "./for";
import { OverpassQueryTagFilterFunction, OverpassQueryTagFilters } from "./query";
import { RecurseFromPrimitiveType } from "./recurse";
import { AnyOverpassQueryTarget, OverpassPositionLiteralExpression, OverpassQueryTargetExpression } from "./target";

export interface AndChainableOverpassStatement {
	and(
		statement:
			| ChainableOverpassStatement
			| ((chain: OverpassChainableTargetableState) => ChainableOverpassStatement),
	): OverpassTargetStateStatement;
}

export type OverpassTargetStateStatement = AndChainableOverpassStatement & ComposableOverpassStatement;

export interface OverpassRecurseFilterStatement extends OverpassTargetStateStatement {
	inSet(set: OverpassExpression<string>): OverpassRecurseFilterStatement;
	withRole(role: OverpassExpression<string>): OverpassRecurseFilterStatement;
	withoutRole(): OverpassRecurseFilterStatement;
}

export interface OverpassTargetState {
	/**
	 * The elements that satisfy {@link tagFilter}
	 * @deprecated since 1.8.0, will be removed on 2.x.x, use {@link byTags}
	 */
	query(tagFilter: OverpassQueryTagFilters | OverpassQueryTagFilterFunction): OverpassTargetStateStatement;
	/** The elements that satisfy {@link tagFilter} */
	byTags(tagFilter: OverpassQueryTagFilters | OverpassQueryTagFilterFunction): OverpassTargetStateStatement;
	/** The elements that are inside the bounding box */
	bbox(...params: OverpassBoundingBox): OverpassTargetStateStatement;
	bbox(bbox: OverpassExpression<OverpassBoundingBox>): OverpassTargetStateStatement;
	/** Fetch by {@link id} */
	byId(id: OverpassExpression<number> | OverpassExpression<number>[]): OverpassTargetStateStatement;
	/** The elements that are inside a {@link polygon} */
	inside(polygon: OverpassPositionLiteralExpression[]): OverpassTargetStateStatement;
	/** Those elements that satisfy {@link predicate} */
	filter(predicate: (e: OverpassItemEvaluatorBuilder) => OverpassEvaluator<boolean>): OverpassTargetStateStatement;
	/**
	 * Those elements within a certain {@link radius} around the {@link center}
	 * @param radius in meters
	 */
	aroundCenter(
		radius: OverpassExpression<number>,
		center: OverpassExpression<OverpassGeoPos>,
	): OverpassTargetStateStatement;
	/**
	 * Those elements within a certain {@link radius} around the elements in the input {@link set}
	 * @param radius in meters
	 * @param set if unspecified asumes the default set
	 */
	aroundSet(radius: OverpassExpression<number>, set?: OverpassExpression<string>): OverpassTargetStateStatement;
	/**
	 * Those elements within a certain {@link radius} around the specified {@link line}
	 * @param radius in meters
	 */
	aroundLine(
		radius: OverpassExpression<number>,
		line: OverpassPositionLiteralExpression[],
	): OverpassTargetStateStatement;
	/**
	 * Those elements that are inside the given area or areas in the specified {@link set}.
	 * @param set if unspecified asumes the default set
	 */
	inArea(set?: OverpassExpression<string>): OverpassTargetStateStatement;
	/**
	 * The elements that defines the outline of the given areas specified in {@link set}
	 * Does not work with nodes {@link OverpassQueryTarget.Node}
	 * @param set if unspecified asumes the default set
	 */
	pivot(set?: OverpassExpression<string>): OverpassTargetStateStatement;
	/**
	 * Select child nodes, ways or relations from {@link type}
	 * Relations have all types of elements.
	 * Ways have nodes.
	 * @param inSet wether to use a specific set for the source elements
	 * @param withRole wether to filter elements from a relation of a specific role
	 */
	recurseFrom(
		type: RecurseFromPrimitiveType | ParamItem<OverpassQueryTarget>,
		inSet?: OverpassExpression<string>,
		withRole?: string,
	): OverpassRecurseFilterStatement;
	/**
	 * Select parent ways or relations from {@link type}
	 * Relations have all types of elements.
	 * Ways have nodes.
	 * @param inSet wether to use a specific set for the source elements
	 * @param withRole wether to filter elements from a relation of a specific role
	 */
	recurseBackwards(
		type: OverpassQueryTargetExpression,
		inSet?: OverpassExpression<string>,
		withRole?: string,
	): OverpassRecurseFilterStatement;
}

/** Runs the statement for the specified {@link target} */
export type OverpassTargetableState = {
	[K in keyof OverpassTargetState]: (
		target: OverpassQueryTargetExpression,
		...args: Parameters<OverpassTargetState[K]>
	) => ReturnType<OverpassTargetState[K]>;
};

export interface OverpassTargetMapState extends OverpassTargetState {
	/** Intersect many {@link sets} */
	intersect(
		set1: OverpassExpression<string>,
		...sets: OverpassExpression<string>[]
	): ComposableOverpassStatement & OverpassTargetState;
}

/** Runs the statement for the selected key target @see AnyOverpassQueryTarget */
export type OverpassTargetMap = { [K in AnyOverpassQueryTarget]: OverpassTargetMapState };

/** Returns a statement that can be chained */
export type OverpassChainableTargetableState = {
	[K in keyof OverpassTargetState]: (...args: Parameters<OverpassTargetState[K]>) => ChainableOverpassStatement;
};

export interface OverpassStateMethods {
	readonly chain: OverpassChainableTargetableState;

	/**
	 * Fallback for things that are not currently implemented
	 * Avoid using if possible
	 */
	statement(statement: string): OverpassStatement;
	statement(compile: CompileFunction): OverpassStatement;

	/**
	 * Fallback for things that are not currently implemented
	 * Avoid using if possible
	 * This statement is expected to be usable within unions and such.
	 */
	composableStatement(statement: string): ComposableOverpassStatement;
	composableStatement(compile: CompileFunction): ComposableOverpassStatement;

	/** The contents of {@link set} */
	set(
		target: OverpassQueryTargetExpression,
		set: OverpassExpression<string>,
	): ComposableOverpassStatement & OverpassTargetState;

	/** Intersect many {@link sets} */
	intersect(
		target: OverpassQueryTargetExpression,
		set1: OverpassExpression<string>,
		...sets: OverpassExpression<string>[]
	): ComposableOverpassStatement & OverpassTargetState;

	recurse(
		type: OverpassExpression<OverpassRecurseStmType>,
		input?: OverpassExpression<string>,
	): ComposableOverpassStatement;

	out(options: OverpassOutputOptions): OverpassStatement;

	/** Iterate over the elements of the default set */
	forEach(body: OverpassForEachBodyFunction): OverpassStatement;
	/** Iterate over the elements of {@link set} */
	forEach(set: OverpassExpression<string>, body: OverpassForEachBodyFunction): OverpassStatement;
	/**
	 * Iterate over the elements of {@link set} with a variable for {@link item}
	 * @param set if null uses the default set
	 */
	forEach(
		set: OverpassExpression<string> | null,
		item: OverpassExpression<string>,
		body: OverpassForEachBodyFunction,
	): OverpassStatement;

	/** Join the elements of {@link statements} together */
	union(...statements: ComposableOverpassStatement[]): ComposableOverpassStatement;
}

/**
 * This type helps with creation of statements
 *
 * @see OverpassTargetMap
 * @see OverpassTargetableState
 *
 * @example ```typescript
 *  (s: OverpassState) => [
 *      s.node.byId(1),
 *      s[OverpassQueryTarget.NodeWayRelation].byId(1),
 *      s.byId("way", 1),
 *      s.byId(OverpassQueryTarget.Relation, 1)
 *  ]
 * ```
 */
export type OverpassState = OverpassTargetMap & OverpassTargetableState & OverpassStateMethods;
