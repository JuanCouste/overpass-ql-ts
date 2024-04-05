import { OverpassQueryTarget, OverpassRecurseStmType } from "@/model/enum";
import { OverpassExpression } from "@/model/expression";
import {
	ChainableOverpassStatement,
	CompileFunction,
	ComposableOverpassStatement,
	OverpassEvaluator,
	OverpassStatement,
} from "@/model/parts";
import { OverpassBoundingBox, OverpassGeoPos } from "@/model/types";
import { OverpassItemEvaluatorBuilder } from "./evaluator";
import { OverpassQueryFilter, OverpassQueryFilterFunction } from "./query";

export type OverpassQueryTargetString = "any" | "node" | "way" | "relation";

export type AnyOverpassQueryTarget = OverpassQueryTarget | OverpassQueryTargetString;

export type OverpassPolygonCoordExpression = [number, number] | OverpassExpression<OverpassGeoPos>;

export type OverpassQueryTargetExpression = AnyOverpassQueryTarget | OverpassExpression<OverpassQueryTarget>;

export interface AndChainableOverpassStatement {
	and(
		statement:
			| ChainableOverpassStatement
			| ((chain: OverpassChainableTargetableState) => ChainableOverpassStatement),
	): OverpassTargetStateStatement;
}

export type OverpassTargetStateStatement = AndChainableOverpassStatement & ComposableOverpassStatement;

export interface OverpassTargetState {
	/** The elements that satisfy {@link filter} */
	query(filter: OverpassQueryFilter | OverpassQueryFilterFunction): OverpassTargetStateStatement;
	/** The elements that are inside the bounding box */
	bbox(...params: OverpassBoundingBox): OverpassTargetStateStatement;
	bbox(bbox: OverpassExpression<OverpassBoundingBox>): OverpassTargetStateStatement;
	/** Fetch by {@link id} */
	byId(id: OverpassExpression<number>): OverpassTargetStateStatement;
	/** The elements that are inside a {@link polygon} */
	inside(polygon: OverpassPolygonCoordExpression[]): OverpassTargetStateStatement;
	/** Those elements that satisfy {@link predicate} */
	filter(predicate: (e: OverpassItemEvaluatorBuilder) => OverpassEvaluator<boolean>): OverpassTargetStateStatement;
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
