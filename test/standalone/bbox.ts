import { BuildApi } from "?/utils";
import { OverpassApiObject, OverpassBoundingBox } from "@/index";
import { expect, it } from "@jest/globals";

export function standaloneBBoxTests() {
	it("Should fetch relations in bbox", async () => {
		const api: OverpassApiObject = BuildApi();

		const plazaZabalaId = 1219932;
		const plazaZabalaBBox: OverpassBoundingBox = [-34.9071182, -56.2074205, -34.9071182, -56.2074205];

		const { elements } = await api.execJson((s) => s.relation.bbox(plazaZabalaBBox));

		const zabala = elements.find((element) => element.id == plazaZabalaId);

		expect(zabala).toBeDefined();
		expect(zabala!.type).toBe("relation");
	});

	it("Should fetch nodes in bbox", async () => {
		const api: OverpassApiObject = BuildApi();

		const plazaZabalaHouseId = 944153833;
		const plazaZabalaBBox: OverpassBoundingBox = [-34.9071182, -56.2074205, -34.9071182, -56.2074205];

		const { elements } = await api.execJson((s) => s.node.bbox(plazaZabalaBBox));

		const zabala = elements.find((element) => element.id == plazaZabalaHouseId);

		expect(zabala).toBeDefined();
		expect(zabala!.type).toBe("node");
	});

	it("Should fetch ways in bbox", async () => {
		const api: OverpassApiObject = BuildApi();

		const plazaZabalaWayId = 455181244;
		const plazaZabalaWayBBox: OverpassBoundingBox = [-34.907121, -56.207423, -34.907116, -56.207418];

		const { elements } = await api.execJson((s) => s.way.bbox(plazaZabalaWayBBox));

		const zabala = elements.find((element) => element.id == plazaZabalaWayId);

		expect(zabala).toBeDefined();
		expect(zabala!.type).toBe("way");
	});
}
