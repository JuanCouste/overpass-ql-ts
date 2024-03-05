import { BuildApi, JBO_G_BBOX, JBO_STATUE_ID, ONLY_IDS } from "?/utils";
import { OverpassApiObject } from "@/model";
import { expect, it } from "@jest/globals";

export function booleanEvaluatorTests() {
	it("Should handle evaluator not", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.id().eq(JBO_STATUE_ID).not()),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(0);
	});

	it("Should handle evaluator double negation", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.id().neq(JBO_STATUE_ID).not()),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});

	it("Should handle evaluator or true", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.id().neq(JBO_STATUE_ID).or(e.true)),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});

	it("Should handle evaluator or false", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.id().neq(JBO_STATUE_ID).or(e.true)),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		const [element] = result.elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});

	it("Should handle evaluator or false true", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.id().neq(JBO_STATUE_ID).or(e.false, e.true)),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});

	it("Should handle evaluator and false", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.id().eq(JBO_STATUE_ID).and(e.false)),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(0);
	});

	it("Should handle evaluator and true false", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.id().eq(JBO_STATUE_ID).and(e.true, e.false)),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(0);
	});

	it("Should handle evaluator false and true", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.id().neq(JBO_STATUE_ID).and(e.true)),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(0);
	});

	it("Should handle evaluator true and true", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.id().eq(JBO_STATUE_ID).and(e.true)),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});

	it("Should handle conditional false result", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.true.conditional(e.false, e.true)),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(0);
	});

	it("Should handle conditional true result", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.true.conditional(e.true, e.false)),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});

	it("Should handle conditional false condition", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.false.conditional(e.true, e.false)),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(0);
	});

	it("Should handle then else false result", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.true.then(e.false).else(e.true)),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(0);
	});

	it("Should handle then else true result", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.true.then(e.true).else(e.false)),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});

	it("Should handle then else false condition", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.false.then(e.true).else(e.false)),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(0);
	});
}
