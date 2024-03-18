/**
 * Node = 0x0001
 * Way = 0x0010
 * Relation = 0x0100
 * --------
 * NodeWay = 0x0011 ( Node | Way )
 * NodeRelation = 0x0101 ( Node | Relation )
 * WayRelation = 0x0110 ( Way | Relation )
 * NodeWayRelation = 0x0111 ( Node | Way | Relation )
 */
export enum OverpassQueryTarget {
	Node = 1,
	Way = 2,
	/** Node | Way */
	NodeWay = 3,
	Relation = 4,
	/** Node | Relation */
	NodeRelation = 5,
	/** Way | Relation */
	WayRelation = 6,
	/** Node | Way | Relation */
	NodeWayRelation = 7,
	Area = 8,
	Derived = 9,
}

export interface OverpassGeoPos {
	readonly lat: number;
	readonly lon: number;
}

export type OverpassBoundingBox = [south: number, west: number, north: number, east: number];

/** Recurse standalone statements take an input set, and produce a result set */
export enum OverpassRecurseStmType {
	/**
	 * All ways that have a node which appears in the input set
	 * All relations that have a node or way which appears in the input set
	 * All relations that have a way which appears in the result set
	 */
	Up,
	/**
	 * All nodes that are part of a way which appears in the input set; plus
	 * All nodes and ways that are members of a relation which appears in the input set; plus
	 * All nodes that are part of a way which appears in the result set
	 */
	Down,
	/**
	 * Additional to {@link OverpassRecurseStmType.Up}, it continues to follow backlinks onto the found relations
	 * until it contains all relations that point to an object in the input or result set.
	 */
	UpRelations,
	/**
	 * Additional to {@link OverpassRecurseStmType.Down}, it continues to follow the membership links including nodes in ways
	 * until for every object in its input or result set all the members of that object are in the result set as well.
	 */
	DownRelations,
}
