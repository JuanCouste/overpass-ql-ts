import "./checkConnection";
//
import { ComposableOverpassStatement, OverpassApiObject, OverpassState } from "@/index";
import { describe, expect, it } from "@jest/globals";
import { BuildApi, MDEO_ID, ONLY_IDS, URUGUAY_ID } from "./utils";

describe("Statement", () => {
	it("Should fetch statement unions", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson((s: OverpassState) => {
			const mdeoStm = s.node.byId(MDEO_ID) as ComposableOverpassStatement;
			const uruStm = s.relation.byId(URUGUAY_ID);
			return [mdeoStm.union(uruStm)];
		}, ONLY_IDS);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([URUGUAY_ID, MDEO_ID]);
	});

	it("Should fetch statement difference", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson((s: OverpassState) => {
			const mdeoStm = s.node.byTags({ name: "Montevideo" }) as ComposableOverpassStatement;
			const mdeoNoCap = s.node.byTags((b) => ({
				name: "Montevideo",
				capital: b.not.exists(),
			}));
			return [mdeoStm.difference(mdeoNoCap)];
		}, ONLY_IDS);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should allow fallback composable statements", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson((s: OverpassState) => {
			const composable: ComposableOverpassStatement = s.composableStatement(`node(${MDEO_ID})`);
			return [composable.union(s.relation.byId(URUGUAY_ID))];
		}, ONLY_IDS);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([URUGUAY_ID, MDEO_ID]);
	});

	it("Should allow fallback composable statements with compile utils", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson((s: OverpassState) => {
			const composable: ComposableOverpassStatement = s.composableStatement(
				(u) => u.template`node(${u.number(MDEO_ID)})`,
			);
			return [composable.union(s.relation.byId(URUGUAY_ID))];
		}, ONLY_IDS);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([URUGUAY_ID, MDEO_ID]);
	});

	it("Should handle semicolon with fallback composable statements", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson((s: OverpassState) => {
			const composable: ComposableOverpassStatement = s.composableStatement(`node(${MDEO_ID});`);
			return [composable.union(s.relation.byId(URUGUAY_ID))];
		}, ONLY_IDS);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([URUGUAY_ID, MDEO_ID]);
	});

	it("Should handle semicolon with fallback statements", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson((s: OverpassState) => [s.statement(`node(${MDEO_ID});`)], ONLY_IDS);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should handle semicolon with fallback statements with compile utils", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s: OverpassState) => [s.statement((u) => u.template`node(${u.number(MDEO_ID)});`)],
			ONLY_IDS,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should allow for statements that do not end in semicolon", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(
			(s: OverpassState) => [s.statement(`if(0) { rel(${URUGUAY_ID}); } else { node(${MDEO_ID}); }`)],
			ONLY_IDS,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});
});
