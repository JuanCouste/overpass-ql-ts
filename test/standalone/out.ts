import { BuildApi, MDEO_ID } from "?/utils";
import { OverpassApiObject } from "@/index";
import { it } from "@jest/globals";
import expect from "expect";

export function standaloneOutTests() {
	it("Should handle custom outs ", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson(
			(s) => [s.node.byId(MDEO_ID).toSet("out"), s.out({ targetSet: "out" })],
			{ targetSet: "_" },
		);

		expect(elements.length).toBe(1);

		const [element] = elements;

		expect(element.id).toBe(MDEO_ID);
		expect(element.type).toBe("node");
	});
}
