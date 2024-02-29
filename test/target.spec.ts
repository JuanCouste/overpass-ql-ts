import "./checkConnection";
//
import { OverpassApiObject, OverpassQueryTarget } from "@/model";
import { describe, it } from "@jest/globals";
import expect from "expect";
import { BuildApi, MDEO_ID, MDEO_LABEL_ID, URUGUAY_ID } from "./utils";

describe("Target", () => {
	it("Should handle intersections", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson((s) => [
			s.node.query({ name: "Montevideo" }).toSet("mdeo"),
			s.node.query((b) => ({ population: b.exists() })).toSet("pop"),
			s.node.intersect("mdeo", "pop"),
		]);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((element) => element.id);
		ids.sort();

		expect(ids).toEqual([MDEO_ID, MDEO_LABEL_ID]);
	});

	it("Should handle intersections with chained statements", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson((s) => [
			s.node.query({ name: "Montevideo" }).toSet("mdeo"),
			s.node.query((b) => ({ population: b.exists() })).toSet("pop"),
			s
				.intersect(OverpassQueryTarget.Node, "mdeo", "pop")
				.bbox(-34.91825445961721, -56.2253878509854, -34.89643102124763, -56.16596617125809),
		]);

		expect(result.elements.length).toBe(1);

		const element = result.elements[0];

		expect(element.id).toBe(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should handle intersection union", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson((s) => [
			s.node.query({ name: "Montevideo" }).toSet("mdeo"),
			s.node.query((b) => ({ population: b.exists() })).toSet("pop"),
			s.node.intersect("mdeo", "pop").union(s.relation.byId(URUGUAY_ID)),
		]);

		expect(result.elements.length).toBe(3);

		const ids = result.elements.map((element) => element.id);
		ids.sort();

		expect(ids).toEqual([URUGUAY_ID, MDEO_ID, MDEO_LABEL_ID]);
	});

	it("Should handle intersection difference", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson((s) => [
			s.node.query({ name: "Montevideo" }).toSet("mdeo"),
			s.node.query((b) => ({ population: b.exists() })).toSet("pop"),
			s.node.intersect("mdeo", "pop").difference(s.node.byId(MDEO_LABEL_ID)),
		]);

		expect(result.elements.length).toBe(1);

		const element = result.elements[0];

		expect(element.id).toBe(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should handle intersection to set", async () => {
		const api: OverpassApiObject = BuildApi();

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

		expect(ids).toEqual([MDEO_ID, MDEO_LABEL_ID]);
	});

	it("Should handle plain set", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson((s) => [
			s.node.query((b) => ({ name: "Montevideo", population: b.exists() })).toSet("mdeo"),
			s.set("any", "mdeo"),
		]);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((element) => element.id);
		ids.sort();

		expect(ids).toEqual([MDEO_ID, MDEO_LABEL_ID]);
	});
});
