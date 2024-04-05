import { BuildApi, MDEO_DEP_ID } from "?/utils";
import {
	OverpassApiObject,
	OverpassBoundingBox,
	OverpassJsonOutput,
	OverpassOutputGeoInfo,
	OverpassOutputVerbosity,
	OverpassRelation,
	OverpassSortOrder,
	OverpassState,
} from "@/model";
import { expect, it } from "@jest/globals";

export function apiOutOptionsTests() {
	it("Should run queries with limit", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = (await api.execJson((s: OverpassState) => [s.node.query({ name: "Montevideo" })], {
			limit: 1,
		})) as OverpassJsonOutput;

		expect(result.elements.length).toBe(1);
	});

	it("Should run queries with bounding box", () => {
		const api: OverpassApiObject = BuildApi();

		const boundingBox: OverpassBoundingBox = [-34.9, -56.2, -34.9, -56.2];

		const query = api.buildQuery((s: OverpassState) => [s.node.query({ name: "Zabala" })], { boundingBox });

		expect(query).toMatch(/\(\s*-34.9\s*,\s*-56.2\s*,\s*-34.9\s*,\s*-56.2\s*\)/);
	});

	it("Should run queries with geometry", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = (await api.execJson((s: OverpassState) => [s.relation.byId(MDEO_DEP_ID)], {
			geoInfo: OverpassOutputGeoInfo.BoundingBox,
			verbosity: OverpassOutputVerbosity.Ids,
		})) as OverpassJsonOutput;

		const mdeoDeparment = result.elements[0] as OverpassRelation;

		expect(mdeoDeparment).toHaveProperty("bounds");
	});

	it("Should run queries with sort", () => {
		const api: OverpassApiObject = BuildApi();

		const query = api.buildQuery((s: OverpassState) => [s.node.byId(0)], {
			sortOrder: OverpassSortOrder.QuadtileIndex,
		});

		expect(query).toMatch(/\bqt\b/);
	});

	it("Should run queries with target set", () => {
		const api: OverpassApiObject = BuildApi();

		const query = api.buildQuery((s: OverpassState) => [s.node.byId(0)], { targetSet: "someset" });

		expect(query).toMatch(/\.\s*\bsomeset\b\s*out/);
	});
}
