export interface OverpassGeoPos {
	readonly lat: number;
	readonly lon: number;
}

export type OverpassBoundingBox = [south: number, west: number, north: number, east: number];
