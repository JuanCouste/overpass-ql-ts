import { BuildApi } from "?/utils";
import { OverpassApiObject, OverpassQueryTarget } from "@/index";
import { expect, it } from "@jest/globals";

export function standalonePivotTests() {
	const centroId = 3612274782;
	const cViejaId = 12274782;

	it("Should fetch relations in pivot", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => [
			s.byId(OverpassQueryTarget.Area, centroId).toSet("centro"),
			s.relation.pivot("centro"),
		]);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(cViejaId);
		expect(element.type).toBe("relation");
	});

	it("Should fetch from default set", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => [
			s.byId(OverpassQueryTarget.Area, centroId),
			s.relation.pivot(),
		]);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(cViejaId);
		expect(element.type).toBe("relation");
	});
}
