import { BuildApi, MDEO_BBOX, MDEO_ID, URUGUAY_ID } from "?/utils";
import { OverpassApiObject, OverpassQueryTarget } from "@/index";
import { expect, it } from "@jest/globals";
import { fetchFormsOfStatementWithBBox } from "./target";

export function standaloneQueryTests() {
	it("Should fetch relation queries", async () => {
		const api: OverpassApiObject = BuildApi();

		const forms = await fetchFormsOfStatementWithBBox(
			api,
			"query",
			["relation", OverpassQueryTarget.Relation],
			MDEO_BBOX,
			{ name: "Uruguay" },
		);

		forms.forEach(({ elements }) => {
			expect(elements.length).toEqual(1);

			const [element] = elements;

			expect(element.id).toEqual(URUGUAY_ID);
			expect(element.type).toBe("relation");
		});
	});

	it("Should fetch node queries", async () => {
		const api: OverpassApiObject = BuildApi();

		const forms = await fetchFormsOfStatementWithBBox(api, "query", ["node", OverpassQueryTarget.Node], MDEO_BBOX, {
			capital: "yes",
		});

		forms.forEach(({ elements }) => {
			expect(elements.length).toEqual(1);

			const [element] = elements;

			expect(element.id).toEqual(MDEO_ID);
			expect(element.type).toBe("node");
		});
	});

	it("Should fetch way queries", async () => {
		const api: OverpassApiObject = BuildApi();

		const paranaId = 78119509;

		const forms = await fetchFormsOfStatementWithBBox(api, "query", ["way", OverpassQueryTarget.Way], MDEO_BBOX, {
			name: "Paraná",
		});

		forms.forEach(({ elements }) => {
			expect(elements.length).toEqual(1);

			const [element] = elements;

			expect(element.id).toEqual(paranaId);
			expect(element.type).toBe("way");
		});
	});
}
