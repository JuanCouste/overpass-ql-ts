import { BuildApi, PAL_LEG_BBOX, PAL_LEG_ID } from "?/utils";
import {
	OverpassApiObject,
	OverpassGeoPos,
	OverpassNode,
	OverpassOutputVerbosity,
	OverpassRecurseStmType,
} from "@/index";
import { it } from "@jest/globals";
import expect from "expect";

export function standaloneRecurseTests() {
	it("Should fetch recurse up ways", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson((s) => [s.way.byId(PAL_LEG_ID), s.recurse(OverpassRecurseStmType.Down)], {
			verbosity: OverpassOutputVerbosity.Body,
		});

		const [s, w, n, e] = PAL_LEG_BBOX;

		const center: OverpassGeoPos = { lat: (s + n) / 2, lon: (w + e) / 2 };
		const diff: OverpassGeoPos = { lat: Math.abs(s - n) / 2, lon: Math.abs(w - e) / 2 };

		/**
		 * There is 1 way in the input set
		 * Will output all nodes of that way
		 * All should be inside the bbox ~ 40000 meters squared
		 */
		(result.elements as OverpassNode[]).forEach((element) => {
			expect(element.lat).toBeCloseTo(center.lat, diff.lat);
			expect(element.lon).toBeCloseTo(center.lon, diff.lon);
		});
	});
}
