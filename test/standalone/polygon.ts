import { BuildApi } from "?/utils";
import { PolygonFromBBox } from "?/utils/functions";
import { OverpassApiObject } from "@/index";
import { expect, it } from "@jest/globals";

export function standalonePolygonTests() {
	it("Should fetch relations in polygon", async () => {
		const api: OverpassApiObject = BuildApi();

		const plazaZabalaId = 1219932;
		const plazaZabalaPolygon = PolygonFromBBox([-34.90712, -56.20743, -34.90711, -56.20741]);

		const { elements } = await api.execJson((s) => s.relation.inside(plazaZabalaPolygon));

		const zabala = elements.find((element) => element.id == plazaZabalaId);

		expect(zabala).toBeDefined();
		expect(zabala!.type).toBe("relation");
	});

	it("Should fetch nodes in polygon", async () => {
		const api: OverpassApiObject = BuildApi();

		const plazaZabalaHouseId = 944153833;
		const plazaZabalaPolygon = PolygonFromBBox([-34.90712, -56.20743, -34.90711, -56.20741]);

		const { elements } = await api.execJson((s) => s.node.inside(plazaZabalaPolygon));

		const zabala = elements.find((element) => element.id == plazaZabalaHouseId);

		expect(zabala).toBeDefined();
		expect(zabala!.type).toBe("node");
	});

	it("Should fetch ways in poygon", async () => {
		const api: OverpassApiObject = BuildApi();

		const plazaZabalaWayId = 455181244;
		const plazaZabalaWayPolygon = PolygonFromBBox([-34.907121, -56.207423, -34.907116, -56.207418]);

		const { elements } = await api.execJson((s) => s.way.inside(plazaZabalaWayPolygon));

		const zabala = elements.find((element) => element.id == plazaZabalaWayId);

		expect(zabala).toBeDefined();
		expect(zabala!.type).toBe("way");
	});
}
