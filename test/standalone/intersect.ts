import { expect, it } from "@jest/globals";
import { OverpassApiObject, OverpassState } from "../../src";
import { BuildApi, MDEO_LABEL_ID, ONLY_IDS } from "../utils";

export function standaloneIntersectTests() {
	it("Should intersect elements", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s: OverpassState) => [
				s.node.query({ capital_city: "Montevideo" }).toSet("cap"),
				s.node
					.query((q) => ({
						name: "Montevideo",
						population: q.exists(),
					}))
					.toSet("mdeo"),
				s.node.intersect("cap", "mdeo"),
			],
			ONLY_IDS,
		);

		const montevideoLabel = result.elements.find((el) => el.id == MDEO_LABEL_ID);

		expect(montevideoLabel).toBeDefined();
		expect(montevideoLabel!.type).toBe("node");
	});
}
