import { BuildApi } from "?/utils";
import { OverpassApiObject, OverpassBoundingBox, OverpassQueryTarget } from "@/index";
import { expect, it } from "@jest/globals";
import { fetchFormsOfStatement } from "./target";

export function standaloneBBoxTests() {
	it("Should fetch relations in bbox", async () => {
		const api: OverpassApiObject = BuildApi();

		const plazaZabalaId = 1219932;
		const plazaZabalaBBox: OverpassBoundingBox = [-34.9071182, -56.2074205, -34.9071182, -56.2074205];

		const forms = await fetchFormsOfStatement(
			api,
			"bbox",
			["relation", OverpassQueryTarget.Relation],
			plazaZabalaBBox,
		);

		forms.forEach(({ elements }) => {
			const zabala = elements.find((element) => element.id == plazaZabalaId);

			expect(zabala).toBeDefined();
			expect(zabala!.type).toBe("relation");
		});
	});

	it("Should fetch nodes in bbox", async () => {
		const api: OverpassApiObject = BuildApi();

		const plazaZabalaHouseId = 944153833;
		const plazaZabalaBBox: OverpassBoundingBox = [-34.9071182, -56.2074205, -34.9071182, -56.2074205];

		const forms = await fetchFormsOfStatement(api, "bbox", ["node", OverpassQueryTarget.Node], plazaZabalaBBox);

		forms.forEach(({ elements }) => {
			const zabala = elements.find((element) => element.id == plazaZabalaHouseId);

			expect(zabala).toBeDefined();
			expect(zabala!.type).toBe("node");
		});
	});

	it("Should fetch ways in bbox", async () => {
		const api: OverpassApiObject = BuildApi();

		const plazaZabalaWayId = 455181244;
		const plazaZabalaWayBBox: OverpassBoundingBox = [-34.907121, -56.207423, -34.907116, -56.207418];

		const forms = await fetchFormsOfStatement(api, "bbox", ["way", OverpassQueryTarget.Way], plazaZabalaWayBBox);

		forms.forEach(({ elements }) => {
			const zabala = elements.find((element) => element.id == plazaZabalaWayId);

			expect(zabala).toBeDefined();
			expect(zabala!.type).toBe("way");
		});
	});
}
