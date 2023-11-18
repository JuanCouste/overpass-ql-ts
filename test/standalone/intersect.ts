import { expect, it } from "@jest/globals";
import { OverpassApiObject, OverpassState } from "../../src";
import { buildApi } from "../setup/apiBuilder";
import { mdeoLabelId, onlyIds } from "../testContext";

export function standaloneIntersectTests() {
	it("Should intersect elements", async () => {
		const api: OverpassApiObject = buildApi();

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
			onlyIds,
		);

		const montevideoLabel = result.elements.find((el) => el.id == mdeoLabelId);

		expect(montevideoLabel).toBeDefined();
		expect(montevideoLabel!.type).toBe("node");
	});
}
