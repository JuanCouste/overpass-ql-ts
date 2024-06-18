import { BuildApi } from "?/utils";
import { OverpassApiObject, OverpassQueryTarget } from "@/index";
import { expect, it } from "@jest/globals";

export function standaloneInAreaTests() {
	const centroId = 3612274782;
	const randomParkId = 9283107710;

	it("Should fetch relations in area", async () => {
		const api: OverpassApiObject = BuildApi();

		const museumId = 7259130;

		const { elements } = await api.execJson((s) => [
			s.byId(OverpassQueryTarget.Area, centroId).toSet("centro"),
			s.relation.inArea("centro").and((c) => c.byTags({ tourism: "museum" })),
		]);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(museumId);
		expect(element.type).toBe("relation");
	});

	it("Should fetch nodes in area", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => [
			s.byId(OverpassQueryTarget.Area, centroId).toSet("centro"),
			s.node.inArea("centro").and((c) => c.byTags({ leisure: "park" })),
		]);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(randomParkId);
		expect(element.type).toBe("node");
	});

	it("Should fetch ways in area", async () => {
		const api: OverpassApiObject = BuildApi();

		const pzIndepId = 36001728;

		const { elements } = await api.execJson((s) => [
			s.byId(OverpassQueryTarget.Area, centroId).toSet("centro"),
			s.way.inArea("centro").and((c) => c.byTags((f) => ({ place: "square", leisure: f.not.equals("park") }))),
		]);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(pzIndepId);
		expect(element.type).toBe("way");
	});

	it("Should fetch from default set", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => [
			s.byId(OverpassQueryTarget.Area, centroId),
			s.node.inArea().and((c) => c.byTags({ leisure: "park" })),
		]);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(randomParkId);
		expect(element.type).toBe("node");
	});
}
