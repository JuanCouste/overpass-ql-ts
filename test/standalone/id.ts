import { expect, it } from "@jest/globals";
import { OverpassApiObject, OverpassQueryTarget } from "../../src";
import { buildApi } from "../setup/apiBuilder";
import { montevideoId, uruguayId } from "../testContext";
import { fetchFormsOfStatement } from "./target";

export function standaloneByIdTests() {
	it("Should fetch relations by id", async () => {
		const api: OverpassApiObject = buildApi();

		const forms = await fetchFormsOfStatement(api, "byId", ["relation", OverpassQueryTarget.Relation], uruguayId);

		forms.forEach(({ elements }) => {
			expect(elements.length).toEqual(1);

			const [element] = elements;

			expect(element.id).toEqual(uruguayId);
			expect(element.type).toBe("relation");
		});
	});

	it("Should fetch node by id", async () => {
		const api: OverpassApiObject = buildApi();

		const forms = await fetchFormsOfStatement(api, "byId", ["node", OverpassQueryTarget.Node], montevideoId);

		forms.forEach(({ elements }) => {
			expect(elements.length).toEqual(1);

			const [element] = elements;

			expect(element.id).toEqual(montevideoId);
			expect(element.type).toBe("node");
		});
	});

	it("Should fetch way by id", async () => {
		const api: OverpassApiObject = buildApi();

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
