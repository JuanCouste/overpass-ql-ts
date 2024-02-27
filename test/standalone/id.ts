import { BuildApi, MDEO_ID, URUGUAY_ID } from "?/utils";
import { OverpassApiObject, OverpassQueryTarget } from "@/index";
import { expect, it } from "@jest/globals";
import { fetchFormsOfStatement } from "./target";

export function standaloneByIdTests() {
	it("Should fetch relations by id", async () => {
		const api: OverpassApiObject = BuildApi();

		const forms = await fetchFormsOfStatement(api, "byId", ["relation", OverpassQueryTarget.Relation], URUGUAY_ID);

		forms.forEach(({ elements }) => {
			expect(elements.length).toEqual(1);

			const [element] = elements;

			expect(element.id).toEqual(URUGUAY_ID);
			expect(element.type).toBe("relation");
		});
	});

	it("Should fetch node by id", async () => {
		const api: OverpassApiObject = BuildApi();

		const forms = await fetchFormsOfStatement(api, "byId", ["node", OverpassQueryTarget.Node], MDEO_ID);

		forms.forEach(({ elements }) => {
			expect(elements.length).toEqual(1);

			const [element] = elements;

			expect(element.id).toEqual(MDEO_ID);
			expect(element.type).toBe("node");
		});
	});

	it("Should fetch way by id", async () => {
		const api: OverpassApiObject = BuildApi();

		const av18deJulio1 = 179061655;

		const forms = await fetchFormsOfStatement(api, "byId", ["way", OverpassQueryTarget.Way], av18deJulio1);

		forms.forEach(({ elements }) => {
			expect(elements.length).toEqual(1);

			const [element] = elements;

			expect(element.id).toEqual(av18deJulio1);
			expect(element.type).toBe("way");
		});
	});
}
