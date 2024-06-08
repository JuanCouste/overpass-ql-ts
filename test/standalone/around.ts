import { BuildApi, JBO_BBOX, JBO_STATUE_ID, PAL_LEG_ID, PAL_LEG_POS, PAL_LEG_REL_ID } from "?/utils";
import { GeoPosFromBBox } from "?/utils/functions";
import { OverpassApiObject, OverpassPositionLiteralExpression } from "@/index";
import { expect, it } from "@jest/globals";

export function standaloneAroundTests() {
	standaloneAroundCenterTests();
	standaloneAroundLineTests();
	standaloneAroundSetTests();
}

function standaloneAroundCenterTests() {
	it("Should fetch relations around center", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => s.relation.aroundCenter(80, PAL_LEG_POS));

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(PAL_LEG_REL_ID);
		expect(element.type).toBe("relation");
	});

	it("Should fetch nodes around center", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => s.node.aroundCenter(1, GeoPosFromBBox(JBO_BBOX)));

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});

	it("Should fetch ways around center", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => s.way.aroundCenter(50, PAL_LEG_POS));

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(PAL_LEG_ID);
		expect(element.type).toBe("way");
	});
}

function standaloneAroundLineTests() {
	const perpMis33: OverpassPositionLiteralExpression[] = [
		[-34.90587981377901, -56.20716969774146],
		[-34.90535878903326, -56.20566925675155],
	];

	it("Should fetch relations around line", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => s.relation.aroundLine(8, perpMis33));

		expect(elements.length).toBe(2);

		const ids = elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([1221772, 1221917]);
	});

	const democracyRivera: OverpassPositionLiteralExpression[] = [
		[-34.8935810470169, -56.1630204626027],
		[-34.8938027604605, -56.1665192457316],
	];

	it("Should fetch nodes around line", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => s.node.aroundLine(0.01, democracyRivera));

		expect(elements.length).toBe(2);

		const ids = elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([1685304345, 956108097]);
	});

	it("Should fetch ways around line", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => s.way.aroundLine(8, perpMis33));

		expect(elements.length).toBe(2);

		const ids = elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([78099206, 78104902]);
	});
}

function standaloneAroundSetTests() {
	it("Should fetch relations around center", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => [
			s.way.byId(PAL_LEG_ID).toSet("pleg"),
			s.relation.aroundSet(20, "pleg"),
		]);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(PAL_LEG_REL_ID);
		expect(element.type).toBe("relation");
	});

	it("Should fetch nodes around center", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => [
			s.node.bbox(JBO_BBOX).toSet("jbo"),
			s.node.aroundSet(1, "jbo"),
		]);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});

	it("Should fetch ways around center", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => [
			s.node.byId(4350987017).toSet("pcagancha"),
			s.way.aroundSet(5, "pcagancha"),
		]);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(221323998);
		expect(element.type).toBe("way");
	});
}
