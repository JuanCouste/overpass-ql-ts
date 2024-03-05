import { BuildApi, JBO_STATUE_ID, PAL_LEG_BBOX } from "?/utils";
import { OverpassApiObject, OverpassQueryTarget } from "@/index";
import { expect, it } from "@jest/globals";
import { fetchFormsOfStatementWithBBox } from "./target";

export function standaloneIfFilterTests() {
	it("Should fetch node that satisfy if filter", async () => {
		const api: OverpassApiObject = BuildApi();

		const forms = await fetchFormsOfStatementWithBBox(
			api,
			"filter",
			["node", OverpassQueryTarget.Node],
			PAL_LEG_BBOX,
			(e) => e.boolean((u) => u.raw(`id() == ${JBO_STATUE_ID}`)),
		);

		forms.forEach(({ elements }) => {
			const zabala = elements.find((element) => element.id == JBO_STATUE_ID);

			expect(zabala).toBeDefined();
			expect(zabala!.type).toBe("node");
		});
	});

	it("Should fetch way that satisfy if filter", async () => {
		const api: OverpassApiObject = BuildApi();

		const forms = await fetchFormsOfStatementWithBBox(
			api,
			"filter",
			["way", OverpassQueryTarget.Way],
			PAL_LEG_BBOX,
			(e) => e.boolean((u) => u.raw("id() == 78103379")),
		);

		forms.forEach(({ elements }) => {
			const zabala = elements.find((element) => element.id == 78103379);

			expect(zabala).toBeDefined();
			expect(zabala!.type).toBe("way");
		});
	});

	it("Should fetch relation that satisfy if filter", async () => {
		const api: OverpassApiObject = BuildApi();

		const forms = await fetchFormsOfStatementWithBBox(
			api,
			"filter",
			["relation", OverpassQueryTarget.Relation],
			PAL_LEG_BBOX,
			(e) => e.boolean((u) => u.raw("id() == 1218540")),
		);

		forms.forEach(({ elements }) => {
			const zabala = elements.find((element) => element.id == 1218540);

			expect(zabala).toBeDefined();
			expect(zabala!.type).toBe("relation");
		});
	});
}
