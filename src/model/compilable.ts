export interface CompiledItem<T> {
	/** Wether this item does not depend on a parameter */
	isSimplifiable(): boolean;
	/** Simplifies the expression, presumes {@link isSimplifiable()} to be true */
	simplify(): T;
	/** The expression will eventually yield a string */
	asString(): CompiledItem<string>;
	/** Eventually transforms the expression to a string using {@link callback} */
	transform(callback: (raw: T) => string): CompiledItem<string>;
	/** Resolve the expression value from a function parameters */
	resolve(params: any[]): T;
	/** Compiles the expression from a function parameters */
	compile(params: any[]): string;
}

export type CompiledOverpassBoundingBox = [
	south: CompiledItem<number>,
	west: CompiledItem<number>,
	north: CompiledItem<number>,
	east: CompiledItem<number>,
];

export interface CompiledOverpassGeoPos {
	readonly lat: CompiledItem<number>;
	readonly lon: CompiledItem<number>;
}
