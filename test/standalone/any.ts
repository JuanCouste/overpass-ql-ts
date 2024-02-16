import { expect, it } from "@jest/globals";
import { OverpassApiObject, OverpassBoundingBox, OverpassQueryTarget } from "../../src";
import { buildApi } from "../utils";
import { fetchFormsOfStatement } from "./target";

const circDurangoRelId = 1221561;
const circDurangoWayId = 78105742;
const circDurangoNodeId = 7001716357;

export function standaloneAnyTests() {
	it("Should fetch any in bbox", async () => {
		const api: OverpassApiObject = buildApi();

		const plazaZabalaBBox: OverpassBoundingBox = [
			-34.907353650482534, -56.20776158492537, -34.90724438201883, -56.207662660721624,
		];

		const forms = await fetchFormsOfStatement(
			api,
			"bbox",
			["any", OverpassQueryTarget.NodeWayRelation],
			plazaZabalaBBox,
		);

		forms.forEach(({ elements }) => {
			const rel = elements.find((el) => el.id == circDurangoRelId);
			const way = elements.find((el) => el.id == circDurangoWayId);
			const node = elements.find((el) => el.id == circDurangoNodeId);

			expect(rel).toBeDefined();
			expect(way).toBeDefined();
			expect(node).toBeDefined();

			expect(rel!.type).toBe("relation");
			expect(way!.type).toBe("way");
			expect(node!.type).toBe("node");
		});
	});
}
