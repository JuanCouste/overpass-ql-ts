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
