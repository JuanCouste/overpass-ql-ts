import "./setup/checkConnection";
//
import { describe, expect, it } from "@jest/globals";
import {
	OverpassApiObject,
	OverpassJsonOutput,
	OverpassQueryFilterObject,
	OverpassQueryFilterTuple,
	OverpassQueryTarget,
	OverpassSettings,
	OverpassState,
} from "../src";
import { buildApi } from "./setup/apiBuilder";
import { mdeoCityId, mdeoDeparmentId, montevideoBBox, montevideoId, onlyIds, uruguayId } from "./testContext";

async function queryAlternatives(
	api: OverpassApiObject,
	query: OverpassQueryFilterObject,
): Promise<OverpassJsonOutput[]> {
	const settings: OverpassSettings = { globalBoundingBox: montevideoBBox };

	const tupleArray = Object.entries(query) as OverpassQueryFilterTuple[];

	return await Promise.all<OverpassJsonOutput>([
		api.execJson((s: OverpassState) => [s.node.query(query)], onlyIds, settings),
		api.execJson((s: OverpassState) => [s.node.query(tupleArray)], onlyIds, settings),
		api.execJson((s: OverpassState) => [s.node.query(() => query)], onlyIds, settings),
		api.execJson((s: OverpassState) => [s.node.query(() => tupleArray)], onlyIds, settings),
	]);
}

describe("Query", () => {
	it("Should fetch queries with string values", async () => {
		const api: OverpassApiObject = buildApi();

		const forms = await queryAlternatives(api, { name: "Montevideo", capital: "yes" });

		forms.forEach(({ elements }) => {
			expect(elements.length).toBe(1);
			const [element] = elements;

			expect(element.id).toEqual(montevideoId);
			expect(element.type).toBe("node");
		});
	});

	it("Should fetch queries with filter objects", async () => {
		const api: OverpassApiObject = buildApi();
		const settings: OverpassSettings = { globalBoundingBox: montevideoBBox };

		const result = await api.execJson(
			(s: OverpassState) => [
				s.node.query((b) => ({
					name: b.equals("Montevideo"),
					capital: b.equals("yes"),
				})),
			],
			onlyIds,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(montevideoId);
		expect(element.type).toBe("node");
	});

	it("Should fetch queries with filter objects as tuples", async () => {
		const api: OverpassApiObject = buildApi();
		const settings: OverpassSettings = { globalBoundingBox: montevideoBBox };

		const result = await api.execJson(
			(s: OverpassState) => [
				s.node.query((b) => [
					["name", b.equals("Montevideo")],
					["capital", b.equals("yes")],
				]),
			],
			onlyIds,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(montevideoId);
		expect(element.type).toBe("node");
	});

	it("Should fetch regexp queries", async () => {
		const api: OverpassApiObject = buildApi();

		const forms = await queryAlternatives(api, { name: /^Montevideo$/, capital: /^yes$/ });

		forms.forEach(({ elements }) => {
			expect(elements.length).toBe(1);
			const [element] = elements;

			expect(element.id).toEqual(montevideoId);
			expect(element.type).toBe("node");
		});
	});

	it("Should fetch half regexp queries", async () => {
		const api: OverpassApiObject = buildApi();

		const forms = await queryAlternatives(api, { name: /ontevide/, capital: /es$/ });

		forms.forEach(({ elements }) => {
			expect(elements.length).toBe(1);
			const [element] = elements;

			expect(element.id).toEqual(montevideoId);
			expect(element.type).toBe("node");
		});
	});

	it("Should fetch regexp tuples", async () => {
		const api: OverpassApiObject = buildApi();
		const settings: OverpassSettings = { globalBoundingBox: montevideoBBox };

		const result = await api.execJson(
			(s: OverpassState) => [
				s.node.query((b) => [
					["name", b.regExp(/ontevide/)],
					["capital", b.regExp(/es$/)],
				]),
			],
			onlyIds,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(montevideoId);
		expect(element.type).toBe("node");
	});

	it("Should fetch regexp in keys", async () => {
		const api: OverpassApiObject = buildApi();
		const settings: OverpassSettings = { globalBoundingBox: montevideoBBox };

		const result = await api.execJson(
			(s: OverpassState) => [
				s.node.query(() => [
					[/ame$/, /ontevide/],
					[/^capita/, /es$/],
				]),
			],
			onlyIds,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(montevideoId);
		expect(element.type).toBe("node");
	});

	it("Should fetch exists query", async () => {
		const api: OverpassApiObject = buildApi();
		const settings: OverpassSettings = { globalBoundingBox: montevideoBBox };

		const result = await api.execJson(
			(s: OverpassState) => [
				s.node.query((b) => ({
					name: b.exists(),
					admin_level: b.exists(),
				})),
			],
			onlyIds,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(montevideoId);
		expect(element.type).toBe("node");
	});

	it("Should fetch queries with negated equals", async () => {
		const api: OverpassApiObject = buildApi();
		const settings: OverpassSettings = { globalBoundingBox: montevideoBBox };

		const result = await api.execJson(
			(s: OverpassState) => [
				s[OverpassQueryTarget.NodeWayRelation].query((b) => [
					["admin_level", "2"],
					["capital", b.equals("yes").not()],
				]),
			],
			onlyIds,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(uruguayId);
		expect(element.type).toBe("relation");
	});

	it("Should fetch queries with reversed negated equals", async () => {
		const api: OverpassApiObject = buildApi();
		const settings: OverpassSettings = { globalBoundingBox: montevideoBBox };

		const result = await api.execJson(
			(s: OverpassState) => [
				s[OverpassQueryTarget.NodeWayRelation].query((b) => [
					["admin_level", "2"],
					["capital", b.not.equals("yes")],
				]),
			],
			onlyIds,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(uruguayId);
		expect(element.type).toBe("relation");
	});

	it("Should fetch queries with negated exists", async () => {
		const api: OverpassApiObject = buildApi();
		const settings: OverpassSettings = { globalBoundingBox: montevideoBBox };

		const result = await api.execJson(
			(s: OverpassState) => [
				s[OverpassQueryTarget.NodeWayRelation].query((b) => [
					["admin_level", "2"],
					["capital", b.exists().not()],
				]),
			],
			onlyIds,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(uruguayId);
		expect(element.type).toBe("relation");
	});

	it("Should fetch queries with reversed negated exists", async () => {
		const api: OverpassApiObject = buildApi();
		const settings: OverpassSettings = { globalBoundingBox: montevideoBBox };

		const result = await api.execJson(
			(s: OverpassState) => [
				s[OverpassQueryTarget.NodeWayRelation].query((b) => [
					["admin_level", "2"],
					["capital", b.not.exists()],
				]),
			],
			onlyIds,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(uruguayId);
		expect(element.type).toBe("relation");
	});

	it("Should fetch queries with negated regexp", async () => {
		const api: OverpassApiObject = buildApi();
		const settings: OverpassSettings = { globalBoundingBox: montevideoBBox };

		const result = await api.execJson(
			(s: OverpassState) => [
				s[OverpassQueryTarget.NodeWayRelation].query((b) => [
					["name", "Montevideo"],
					["admin_level", b.exists()],
					["admin_level", b.regExp(/^2$/).not()],
				]),
			],
			onlyIds,
			settings,
		);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([mdeoDeparmentId, mdeoCityId]);
	});

	it("Should fetch queries with reversed negated regexp", async () => {
		const api: OverpassApiObject = buildApi();
		const settings: OverpassSettings = { globalBoundingBox: montevideoBBox };

		const result = await api.execJson(
			(s: OverpassState) => [
				s[OverpassQueryTarget.NodeWayRelation].query((b) => [
					["name", "Montevideo"],
					["admin_level", b.exists()],
					["admin_level", b.not.regExp(/^2$/)],
				]),
			],
			onlyIds,
			settings,
		);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([mdeoDeparmentId, mdeoCityId]);
	});

	it("Should fetch queries with multi filters", async () => {
		const api: OverpassApiObject = buildApi();
		const settings: OverpassSettings = { globalBoundingBox: montevideoBBox };

		const result = await api.execJson(
			(s: OverpassState) => [s.relation.query(() => ({ name: [/^Monte/, /tevi/, /video$/] }))],
			onlyIds,
			settings,
		);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([mdeoDeparmentId, mdeoCityId]);
	});
});
