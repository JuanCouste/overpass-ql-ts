import { OverpassBoundingBox, OverpassGeoPos, OverpassPositionLiteralExpression } from "@/model";

export function PolygonFromBBox([s, w, n, e]: OverpassBoundingBox): OverpassPositionLiteralExpression[] {
	return [
		[s, w],
		[n, w],
		[n, e],
		[s, e],
	];
}

export function GeoPosFromBBox([s, w, n, e]: OverpassBoundingBox, southWest: boolean = true): OverpassGeoPos {
	return southWest ? { lat: s, lon: w } : { lat: n, lon: e };
}
