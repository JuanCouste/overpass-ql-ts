import { expect, it } from "@jest/globals";
import { OverpassApiObject, OverpassQueryTarget } from "../../src";
import { buildApi } from "../setup/apiBuilder";
import { montevideoBBox, montevideoId, uruguayId } from "../testContext";
import { fetchFormsOfStatementWithBBox } from "./target";

export function standaloneQueryTests() {
	it("Should fetch relation queries", async () => {
		const api: OverpassApiObject = buildApi();

		const forms = await fetchFormsOfStatementWithBBox(
			api,
			"query",
			["relation", OverpassQueryTarget.Relation],
			montevideoBBox,
			{ name: "Uruguay" },
		);

		forms.forEach(({ elements }) => {
			expect(elements.length).toEqual(1);

			const [element] = elements;

			expect(element.id).toEqual(uruguayId);
			expect(element.type).toBe("relation");
		});
	});

	it("Should fetch node queries", async () => {
		const api: OverpassApiObject = buildApi();

		const forms = await fetchFormsOfStatementWithBBox(
			api,
			"query",
			["node", OverpassQueryTarget.Node],
			montevideoBBox,
			{ capital: "yes" },
		);

		forms.forEach(({ elements }) => {
			expect(elements.length).toEqual(1);

			const [element] = elements;

			expect(element.id).toEqual(montevideoId);
			expect(element.type).toBe("node");
		});
	});

	it("Should fetch way queries", async () => {
		const api: OverpassApiObject = buildApi();

		const paranaId = 78119509;

		const forms = await fetchFormsOfStatementWithBBox(
			api,
			"query",
			["way", OverpassQueryTarget.Way],
			montevideoBBox,
			{ name: "Paraná" },
		);

		forms.forEach(({ elements }) => {
			expect(elements.length).toEqual(1);

			const [element] = elements;

			expect(element.id).toEqual(paranaId);
			expect(element.type).toBe("way");
		});
	});
}
