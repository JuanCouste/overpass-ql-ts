import "./checkConnection";
//
import { OverpassApiObject, OverpassState } from "@/index";
import { describe, expect, it } from "@jest/globals";
import { BuildApi, MDEO_BBOX, MDEO_ID, ONLY_IDS } from "./utils";

describe("Chaining", () => {
	it("Should allow chaining", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson(
			(s: OverpassState) =>
				s.node
					.query({ name: "Montevideo" })
					.and(s.chain.bbox(MDEO_BBOX))
					.and(s.chain.filter((e) => e.hasTag("capital").and(e.getTag("capital").eq("yes")))),
			ONLY_IDS,
		);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should allow chaining with function", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson(
			(s: OverpassState) =>
				s.node
					.query({ name: "Montevideo" })
					.and((c) => c.bbox(MDEO_BBOX))
					.and((c) => c.filter((e) => e.hasTag("capital").and(e.getTag("capital").eq("yes")))),
			ONLY_IDS,
		);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});
});
