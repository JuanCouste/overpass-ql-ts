import { BuildApi } from "?/utils";
import { OverpassApiObject, OverpassBoundingBox } from "@/index";
import { expect, it } from "@jest/globals";

const circDurangoRelId = 1221561;
const circDurangoWayId = 78105742;
const circDurangoNodeId = 7001716357;

export function standaloneAnyTests() {
	it("Should fetch any in bbox", async () => {
		const api: OverpassApiObject = BuildApi();

		const plazaZabalaBBox: OverpassBoundingBox = [
			-34.907353650482534, -56.20776158492537, -34.90724438201883, -56.207662660721624,
		];

		const { elements } = await api.execJson((s) => s.any.bbox(plazaZabalaBBox));

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
}
