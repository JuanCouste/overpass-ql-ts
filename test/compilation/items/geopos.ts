import { Symetric } from "?/utils";
import { GeoPosParamCompiledItem, ParentCompiledItem } from "@/imp";
import { CompiledItem, OverpassExpression, OverpassGeoPos } from "@/index";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

function BuildGeoPos(value: OverpassExpression<OverpassGeoPos>): CompiledItem<string> {
	const { lat, lon } = GeoPosParamCompiledItem.GeoPos(value);
	return new ParentCompiledItem([lat, lon]);
}

export function parametersGeoPosTests() {
	it("Should be fine when geopos are fine", async () =>
		await ExpectCompileResolves(BuildGeoPos, [Symetric.GeoPos({ lat: 1, lon: 2 })]));

	it(`Should error when geopos are nullish`, async () => {
		await ExpectCompileRejects(BuildGeoPos, [Symetric.GeoPos(null!)]);
		await ExpectCompileRejects(BuildGeoPos, [Symetric.GeoPos(undefined!)]);
	});

	it("Should error when parameter is not a geopos", async () =>
		await ExpectCompileRejects(BuildGeoPos, [Symetric.GeoPos("name" as unknown as OverpassGeoPos)]));

	const coords: (keyof OverpassGeoPos)[] = ["lat", "lon"];

	it(`Should error when geopos coordinate is invalid`, async () => {
		for (const coord of coords) {
			for (const invalid of [NaN, Infinity, null!, undefined!]) {
				await ExpectCompileRejects(BuildGeoPos, [Symetric.GeoPos({ lat: 1, lon: 1, [coord]: invalid })]);
			}
		}
	});

	it(`Should error when geopos coord are out of range`, async () => {
		const ranges: { [K in keyof OverpassGeoPos]: number } = {
			lat: 90,
			lon: 180,
		};

		for (const coord of coords) {
			for (const sign of [+1, -1]) {
				const outOfRange = ranges[coord] + 1;
				await ExpectCompileRejects(BuildGeoPos, [
					Symetric.GeoPos({ lat: 1, lon: 1, [coord]: sign * outOfRange }),
				]);
			}
		}
	});
}
