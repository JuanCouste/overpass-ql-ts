import { OverpassExpression, OverpassGeoPos, OverpassState, OverpassStatement, ParamType } from "../../src";
import { ItSymetrically, StaticAdapter } from "../utils";
import { ExpectParamteterError, ExpectResolves } from "./adapter";

function getInside(state: OverpassState, geoPos: OverpassExpression<OverpassGeoPos>): OverpassStatement {
	return state.node.inside([geoPos]);
}

export function sanitizationGeoPosTests() {
	ItSymetrically(
		"Should be fine when geopos is fine",
		StaticAdapter,
		getInside,
		[{ exp: { lat: 1, lon: 1 }, type: ParamType.GeoPos }],
		ExpectResolves,
	);

	ItSymetrically(
		"Should error when geopos is undefined",
		StaticAdapter,
		getInside,
		[{ exp: undefined! as OverpassGeoPos, type: ParamType.GeoPos }],
		ExpectParamteterError,
	);

	ItSymetrically(
		"Should error when geopos is null",
		StaticAdapter,
		getInside,
		[{ exp: null! as OverpassGeoPos, type: ParamType.GeoPos }],
		ExpectParamteterError,
	);

	Array<number>(NaN, Infinity, null!, undefined!).forEach((number) => {
		ItSymetrically(
			`Should error when geopos lat is ${number}`,
			StaticAdapter,
			getInside,
			[{ exp: { lat: number, lon: 1 }, type: ParamType.GeoPos }],
			ExpectParamteterError,
		);

		ItSymetrically(
			`Should error when geopos lon is ${number}`,
			StaticAdapter,
			getInside,
			[{ exp: { lat: 1, lon: number }, type: ParamType.GeoPos }],
			ExpectParamteterError,
		);
	});

	const ranges: { [K in keyof OverpassGeoPos]: number } = {
		lat: 90,
		lon: 180,
	};

	const coords: (keyof OverpassGeoPos)[] = ["lat", "lon"];

	[+1, -1].forEach((sign) => {
		coords.forEach((coord) => {
			const outOfRange = sign * (ranges[coord] + 1);
			const geoPos: OverpassGeoPos = { lat: 1, lon: 1, ...{ [coord]: outOfRange } };
			const signStr = outOfRange >= 0 ? "+" : "-";

			ItSymetrically(
				`Should error when geopos ${coord} is out of range [${signStr}]`,
				StaticAdapter,
				getInside,
				[{ exp: geoPos, type: ParamType.GeoPos }],
				ExpectParamteterError,
			);
		});
	});
}
