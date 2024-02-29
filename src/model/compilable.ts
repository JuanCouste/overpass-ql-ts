export interface CompiledItem {
	/** Change the resulting raw string */
	withManipulation(manipulation: (raw: string) => string): CompiledItem;
	compile(params: any[]): string;
}

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
