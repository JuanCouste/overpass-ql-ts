import { BuildApi, JBO_G_BBOX, JBO_STATUE_ID, ONLY_IDS } from "?/utils";
import { OverpassApiObject } from "@/model";
import { expect, it } from "@jest/globals";

export function evaluatorTests() {
	it("Should handle evaluator id equals", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson((s) => s.node.filter((e) => e.id().eq(JBO_STATUE_ID)), ONLY_IDS, JBO_G_BBOX);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(JBO_STATUE_ID);
		expect(element.type).toBe("node");
	});

	it("Should handle evaluator id not equals", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson((s) => s.node.filter((e) => e.id().neq(JBO_STATUE_ID)), ONLY_IDS, JBO_G_BBOX);

		expect(result.elements.length).toBe(0);
	});
}
