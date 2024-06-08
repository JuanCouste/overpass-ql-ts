import { BuildApi, MDEO_BBOX, MDEO_ID, URUGUAY_ID } from "?/utils";
import { OverpassApiObject, OverpassSettings } from "@/index";
import { expect, it } from "@jest/globals";

export function standaloneByTagsTests() {
	const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

	it("Should fetch relation queries", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => s.relation.byTags({ name: "Uruguay" }), {}, settings);

		expect(elements.length).toEqual(1);

		const [element] = elements;

		expect(element.id).toEqual(URUGUAY_ID);
		expect(element.type).toBe("relation");
	});

	it("Should fetch node queries", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson(
			(s) =>
				s.node.byTags({
					capital: "yes",
				}),
			{},
			settings,
		);

		expect(elements.length).toEqual(1);

		const [element] = elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should fetch way queries", async () => {
		const api: OverpassApiObject = BuildApi();

		const paranaId = 78119509;
		const { elements } = await api.execJson(
			(s) =>
				s.way.byTags({
					name: "Paraná",
				}),
			{},
			settings,
		);

		expect(elements.length).toEqual(1);

		const [element] = elements;

		expect(element.id).toEqual(paranaId);
		expect(element.type).toBe("way");
	});
}
