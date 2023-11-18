import "./setup/checkConnection";
//
import { describe, expect, it } from "@jest/globals";
import { ComposableOverpassStatement, OverpassApiObject, OverpassState } from "../src";
import { buildApi } from "./setup/apiBuilder";
import { montevideoId, onlyIds, uruguayId } from "./testContext";

describe("Statement", () => {
	it("Should fetch statement unions", async () => {
		const api: OverpassApiObject = buildApi();

		const result = await api.execJson((s: OverpassState) => {
			const mdeoStm = s.node.byId(montevideoId) as ComposableOverpassStatement;
			const uruStm = s.relation.byId(uruguayId);
			return [mdeoStm.union(uruStm)];
		}, onlyIds);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([uruguayId, montevideoId]);
	});

	it("Should fetch statement difference", async () => {
		const api: OverpassApiObject = buildApi();

		const result = await api.execJson((s: OverpassState) => {
			const mdeoStm = s.node.query({ name: "Montevideo" }) as ComposableOverpassStatement;
			const mdeoNoCap = s.node.query((b) => ({
				name: "Montevideo",
				capital: b.not.exists(),
			}));
			return [mdeoStm.difference(mdeoNoCap)];
		}, onlyIds);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(montevideoId);
		expect(element.type).toBe("node");
	});

	it("Should allow fallback composable statements", async () => {
		const api: OverpassApiObject = buildApi();

		const result = await api.execJson((s: OverpassState) => {
			const composable: ComposableOverpassStatement = s.composableStatement(`node(${montevideoId})`);
			return [composable.union(s.relation.byId(uruguayId))];
		}, onlyIds);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([uruguayId, montevideoId]);
	});

	it("Should handle semicolon with fallback composable statements", async () => {
		const api: OverpassApiObject = buildApi();

		const result = await api.execJson((s: OverpassState) => {
			const composable: ComposableOverpassStatement = s.composableStatement(`node(${montevideoId});`);
			return [composable.union(s.relation.byId(uruguayId))];
		}, onlyIds);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([uruguayId, montevideoId]);
	});

	it("Should handle semicolon with fallback statements", async () => {
		const api: OverpassApiObject = buildApi();

		const result = await api.execJson((s: OverpassState) => [s.statement(`node(${montevideoId});`)], onlyIds);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(montevideoId);
		expect(element.type).toBe("node");
	});

	it("Should allow for statements that do not end in semicolon", async () => {
		const api: OverpassApiObject = buildApi();

		const result = await api.execJson(
			(s: OverpassState) => [s.statement(`if(0) { rel(${uruguayId}); } else { node(${montevideoId}); }`)],
			onlyIds,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(montevideoId);
		expect(element.type).toBe("node");
	});
});
