import { BuildApi } from "?/utils";
import { OverpassApiObject, OverpassBoundingBox, OverpassPolygonCoordExpression, OverpassQueryTarget } from "@/index";
import { expect, it } from "@jest/globals";
import { fetchFormsOfStatement } from "./target";

function polygonFromBoundingBox([s, w, n, e]: OverpassBoundingBox): OverpassPolygonCoordExpression[] {
	return [
		[s, w],
		[n, w],
		[n, e],
		[s, e],
	];
}

export function standalonePolygonTests() {
	it("Should fetch relations in polygon", async () => {
		const api: OverpassApiObject = BuildApi();

		const plazaZabalaId = 1219932;
		const plazaZabalaPolygon = polygonFromBoundingBox([-34.90712, -56.20743, -34.90711, -56.20741]);

		const forms = await fetchFormsOfStatement(
			api,
			"inside",
			["relation", OverpassQueryTarget.Relation],
			plazaZabalaPolygon,
		);

		forms.forEach(({ elements }) => {
			const zabala = elements.find((element) => element.id == plazaZabalaId);

			expect(zabala).toBeDefined();
			expect(zabala!.type).toBe("relation");
		});
	});

	it("Should fetch nodes in polygon", async () => {
		const api: OverpassApiObject = BuildApi();

		const plazaZabalaHouseId = 944153833;
		const plazaZabalaPolygon = polygonFromBoundingBox([-34.90712, -56.20743, -34.90711, -56.20741]);

		const forms = await fetchFormsOfStatement(
			api,
			"inside",
			["node", OverpassQueryTarget.Node],
			plazaZabalaPolygon,
		);

		forms.forEach(({ elements }) => {
			const zabala = elements.find((element) => element.id == plazaZabalaHouseId);

			expect(zabala).toBeDefined();
			expect(zabala!.type).toBe("node");
		});
	});

	it("Should fetch ways in poygon", async () => {
		const api: OverpassApiObject = BuildApi();

		const plazaZabalaWayId = 455181244;
		const plazaZabalaWayPolygon = polygonFromBoundingBox([-34.907121, -56.207423, -34.907116, -56.207418]);

		const forms = await fetchFormsOfStatement(
			api,
			"inside",
			["way", OverpassQueryTarget.Way],
			plazaZabalaWayPolygon,
		);

		forms.forEach(({ elements }) => {
			const zabala = elements.find((element) => element.id == plazaZabalaWayId);

			expect(zabala).toBeDefined();
			expect(zabala!.type).toBe("way");
		});
	});
}
