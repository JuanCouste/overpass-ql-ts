import { BuildApi, JBO_STATUE_ID, PAL_LEG_BBOX } from "?/utils";
import { OverpassApiObject, OverpassSettings } from "@/index";
import { expect, it } from "@jest/globals";

export function standaloneIfFilterTests() {
	const settings: OverpassSettings = { globalBoundingBox: PAL_LEG_BBOX };

	it("Should fetch node that satisfy if filter", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson(
			(s) => s.node.filter((e) => e.boolean((u) => u.raw(`id() == ${JBO_STATUE_ID}`))),
			{},
			settings,
		);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});

	it("Should fetch way that satisfy if filter", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson(
			(s) => s.way.filter((e) => e.boolean((u) => u.raw("id() == 78103379"))),
			{},
			settings,
		);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(78103379);
		expect(element.type).toBe("way");
	});

	it("Should fetch relation that satisfy if filter", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson(
			(s) => s.relation.filter((e) => e.boolean((u) => u.raw("id() == 1218540"))),
			{},
			settings,
		);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(1218540);
		expect(element.type).toBe("relation");
	});
}
