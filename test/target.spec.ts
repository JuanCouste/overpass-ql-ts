import "./setup/checkConnection";
//
import { OverpassQueryTarget } from "@/model";
import { OverpassApiObject } from "@/query";
import { describe, it } from "@jest/globals";
import expect from "expect";
import { buildApi } from "./setup/apiBuilder";
import { mdeoLabelId, montevideoId, uruguayId } from "./testContext";

describe("Target", () => {
	it("Should handle intersections", async () => {
		const api: OverpassApiObject = buildApi();

		const result = await api.execJson((s) => [
			s.node.query({ name: "Montevideo" }).toSet("mdeo"),
			s.node.query((b) => ({ population: b.exists() })).toSet("pop"),
			s.node.intersect("mdeo", "pop"),
		]);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((element) => element.id);
		ids.sort();

		expect(ids).toEqual([montevideoId, mdeoLabelId]);
	});

	it("Should handle intersections with chained statements", async () => {
		const api: OverpassApiObject = buildApi();

		const result = await api.execJson((s) => [
			s.node.query({ name: "Montevideo" }).toSet("mdeo"),
			s.node.query((b) => ({ population: b.exists() })).toSet("pop"),
			s
				.intersect(OverpassQueryTarget.Node, "mdeo", "pop")
				.bbox(-34.91825445961721, -56.2253878509854, -34.89643102124763, -56.16596617125809),
		]);

		expect(result.elements.length).toBe(1);

		const element = result.elements[0];

		expect(element.id).toBe(montevideoId);
		expect(element.type).toBe("node");
	});

	it("Should handle intersection union", async () => {
		const api: OverpassApiObject = buildApi();

		const result = await api.execJson((s) => [
			s.node.query({ name: "Montevideo" }).toSet("mdeo"),
			s.node.query((b) => ({ population: b.exists() })).toSet("pop"),
			s.node.intersect("mdeo", "pop").union(s.relation.byId(uruguayId)),
		]);

		expect(result.elements.length).toBe(3);

		const ids = result.elements.map((element) => element.id);
		ids.sort();

		expect(ids).toEqual([uruguayId, montevideoId, mdeoLabelId]);
	});

	it("Should handle intersection difference", async () => {
		const api: OverpassApiObject = buildApi();

		const result = await api.execJson((s) => [
			s.node.query({ name: "Montevideo" }).toSet("mdeo"),
			s.node.query((b) => ({ population: b.exists() })).toSet("pop"),
			s.node.intersect("mdeo", "pop").difference(s.node.byId(mdeoLabelId)),
		]);

		expect(result.elements.length).toBe(1);

		const element = result.elements[0];

		expect(element.id).toBe(montevideoId);
		expect(element.type).toBe("node");
	});

	it("Should handle intersection to set", async () => {
		const api: OverpassApiObject = buildApi();

		const result = await api.execJson(
			(s) => [
				s.node.query({ name: "Montevideo" }).toSet("mdeo"),
				s.node.query((b) => ({ population: b.exists() })).toSet("pop"),
				s.node.intersect("mdeo", "pop").toSet("mdeoPop"),
			],
			{ targetSet: "mdeoPop" },
		);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((element) => element.id);
		ids.sort();

		expect(ids).toEqual([montevideoId, mdeoLabelId]);
	});

	it("Should handle plain set", async () => {
		const api: OverpassApiObject = buildApi();

		const result = await api.execJson((s) => [
			s.node.query((b) => ({ name: "Montevideo", population: b.exists() })).toSet("mdeo"),
			s.set("any", "mdeo"),
		]);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((element) => element.id);
		ids.sort();

		expect(ids).toEqual([montevideoId, mdeoLabelId]);
	});
});
