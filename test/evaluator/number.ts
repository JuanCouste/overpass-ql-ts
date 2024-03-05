import { BuildApi, JBO_G_BBOX, JBO_STATUE_ID, ONLY_IDS } from "?/utils";
import { OverpassApiObject } from "@/model";
import { expect, it } from "@jest/globals";

export function numberEvaluatorTests() {
	it("Should handle evaluator abs", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.id().eq(e.number(-JBO_STATUE_ID).abs())),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});

	it("Should handle evaluator plus", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.id().eq(e.number(JBO_STATUE_ID - 1).plus(1))),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});

	it("Should handle evaluator minus", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.id().eq(e.number(JBO_STATUE_ID + 1).minus(1))),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});

	it("Should handle evaluator times", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) =>
				s.node.filter((e) =>
					e.id().eq(
						e
							.number(Math.floor(JBO_STATUE_ID / 2))
							.times(2)
							.plus(1),
					),
				),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});

	it("Should handle evaluator divide", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s) => s.node.filter((e) => e.id().eq(e.number(JBO_STATUE_ID * 2).dividedBy(2))),
			ONLY_IDS,
			JBO_G_BBOX,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});
}
