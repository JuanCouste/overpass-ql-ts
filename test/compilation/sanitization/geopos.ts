import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { Symetric } from "?/utils";
import { OverpassCompileUtils } from "@/imp";
import { OverpassExpression, OverpassGeoPos } from "@/index";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

function BuildGeoPos(value: OverpassExpression<OverpassGeoPos>) {
	const u = new OverpassCompileUtils(NO_SANITIZER);
	const { lat, lon } = u.geoPos(value);
	return u.join([lat, lon], ",");
}

export function sanitizationGeoPosTests() {
	it("Should be fine when geopos are fine", async () => {
		await ExpectCompileResolves(BuildGeoPos, [Symetric.GeoPos({ lat: 1, lon: 2 })]);
	});

	it("Should error when geopos are undefined", async () => {
		await ExpectCompileRejects(BuildGeoPos, [Symetric.GeoPos(undefined!)]);
	});

	it("Should error when geopos are null", async () => {
		await ExpectCompileRejects(BuildGeoPos, [Symetric.GeoPos(null!)]);
	});

	it("Should error when parameter is not a geopos", async () => {
		await ExpectCompileRejects(BuildGeoPos, [Symetric.GeoPos("name" as unknown as OverpassGeoPos)]);
	});

	Array<number>(NaN, Infinity, null!, undefined!).forEach((number) => {
		it(`Should error when geopos lat is ${number}`, async () => {
			await ExpectCompileRejects(BuildGeoPos, [Symetric.GeoPos({ lat: number, lon: 1 })]);
		});

		it(`Should error when geopos lon is ${number}`, async () => {
			await ExpectCompileRejects(BuildGeoPos, [Symetric.GeoPos({ lat: 1, lon: number })]);
		});
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

			it(`Should error when geopos ${coord} is out of range [${signStr}]`, async () => {
				await ExpectCompileRejects(BuildGeoPos, [Symetric.GeoPos(geoPos)]);
			});
		});
	});
}
