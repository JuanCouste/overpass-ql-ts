import { BuildApi, PAL_LEG_BBOX, PAL_LEG_ID, PLAZA_INDEP_ID } from "?/utils";
import { OverpassApiObject, OverpassGeoPos, OverpassNode, OverpassOutputVerbosity } from "@/index";
import { expect, it } from "@jest/globals";

export function standaloneRecurseTests() {
	it("Should fetch recurse from ways", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson(
			(s) => [s.way.byId(PAL_LEG_ID).toSet("pleg"), s.node.recurseFrom("way", "pleg")],
			{ verbosity: OverpassOutputVerbosity.Body },
		);

		const [s, w, n, e] = PAL_LEG_BBOX;

		const center: OverpassGeoPos = { lat: (s + n) / 2, lon: (w + e) / 2 };
		const diff: OverpassGeoPos = { lat: Math.abs(s - n) / 2, lon: Math.abs(w - e) / 2 };

		/**
		 * There is 1 way in the input set
		 * Will output all nodes of that way
		 * All should be inside the bbox ~ 40000 meters squared
		 */
		(elements as OverpassNode[]).forEach((element) => {
			expect(element.lat).toBeCloseTo(center.lat, diff.lat);
			expect(element.lon).toBeCloseTo(center.lon, diff.lon);
		});
	});

	it("Should fetch recurse to relations", async () => {
		const api: OverpassApiObject = BuildApi();
		const pIndepMuseumId = 945548540;

		const { elements } = await api.execJson(
			(s) => [s.node.byId(pIndepMuseumId).toSet("pindm"), s.relation.recurseBackwards("node", "pindm")],
			{ verbosity: OverpassOutputVerbosity.Body },
		);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(PLAZA_INDEP_ID);
		expect(element.type).toBe("relation");
	});
}
