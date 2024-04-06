import "./checkConnection";
//
import {
	OverpassApiObject,
	OverpassJsonOutput,
	OverpassQueryTagFilterTuple,
	OverpassQueryTagFitlerObject,
	OverpassQueryTarget,
	OverpassSettings,
	OverpassState,
} from "@/index";
import { describe, expect, it } from "@jest/globals";
import { BuildApi, MDEO_BBOX, MDEO_CITY_ID, MDEO_DEP_ID, MDEO_ID, ONLY_IDS, URUGUAY_ID } from "./utils";

async function queryAlternatives(
	api: OverpassApiObject,
	query: OverpassQueryTagFitlerObject,
): Promise<OverpassJsonOutput[]> {
	const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

	const tupleArray = Object.entries(query) as OverpassQueryTagFilterTuple[];

	return await Promise.all<OverpassJsonOutput>([
		api.execJson((s: OverpassState) => [s.node.query(query)], ONLY_IDS, settings),
		api.execJson((s: OverpassState) => [s.node.query(tupleArray)], ONLY_IDS, settings),
		api.execJson((s: OverpassState) => [s.node.query(() => query)], ONLY_IDS, settings),
		api.execJson((s: OverpassState) => [s.node.query(() => tupleArray)], ONLY_IDS, settings),
	]);
}

describe("Query", () => {
	it("Should fetch queries with string values", async () => {
		const api: OverpassApiObject = BuildApi();

		const forms = await queryAlternatives(api, { name: "Montevideo", capital: "yes" });

		forms.forEach(({ elements }) => {
			expect(elements.length).toBe(1);
			const [element] = elements;

			expect(element.id).toEqual(MDEO_ID);
			expect(element.type).toBe("node");
		});
	});

	it("Should fetch queries with filter objects", async () => {
		const api: OverpassApiObject = BuildApi();
		const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

		const result = await api.execJson(
			(s: OverpassState) => [
				s.node.query((b) => ({
					name: b.equals("Montevideo"),
					capital: b.equals("yes"),
				})),
			],
			ONLY_IDS,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should fetch queries with filter objects as tuples", async () => {
		const api: OverpassApiObject = BuildApi();
		const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

		const result = await api.execJson(
			(s: OverpassState) => [
				s.node.query((b) => [
					["name", b.equals("Montevideo")],
					["capital", b.equals("yes")],
				]),
			],
			ONLY_IDS,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should fetch regexp queries", async () => {
		const api: OverpassApiObject = BuildApi();

		const forms = await queryAlternatives(api, { name: /^Montevideo$/, capital: /^yes$/ });

		forms.forEach(({ elements }) => {
			expect(elements.length).toBe(1);
			const [element] = elements;

			expect(element.id).toEqual(MDEO_ID);
			expect(element.type).toBe("node");
		});
	});

	it("Should fetch half regexp queries", async () => {
		const api: OverpassApiObject = BuildApi();

		const forms = await queryAlternatives(api, { name: /ontevide/, capital: /es$/ });

		forms.forEach(({ elements }) => {
			expect(elements.length).toBe(1);
			const [element] = elements;

			expect(element.id).toEqual(MDEO_ID);
			expect(element.type).toBe("node");
		});
	});

	it("Should fetch regexp tuples", async () => {
		const api: OverpassApiObject = BuildApi();
		const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

		const result = await api.execJson(
			(s: OverpassState) => [
				s.node.query((b) => [
					["name", b.regExp(/ontevide/)],
					["capital", b.regExp(/es$/)],
				]),
			],
			ONLY_IDS,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should fetch regexp in keys", async () => {
		const api: OverpassApiObject = BuildApi();
		const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

		const result = await api.execJson(
			(s: OverpassState) => [
				s.node.query(() => [
					[/ame$/, /ontevide/],
					[/^capita/, /es$/],
				]),
			],
			ONLY_IDS,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should fetch exists query", async () => {
		const api: OverpassApiObject = BuildApi();
		const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

		const result = await api.execJson(
			(s: OverpassState) => [
				s.node.query((b) => ({
					name: b.exists(),
					admin_level: b.exists(),
				})),
			],
			ONLY_IDS,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should fetch queries with negated equals", async () => {
		const api: OverpassApiObject = BuildApi();
		const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

		const result = await api.execJson(
			(s: OverpassState) => [
				s[OverpassQueryTarget.NodeWayRelation].query((b) => [
					["admin_level", "2"],
					["capital", b.equals("yes").not()],
				]),
			],
			ONLY_IDS,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(URUGUAY_ID);
		expect(element.type).toBe("relation");
	});

	it("Should fetch queries with reversed negated equals", async () => {
		const api: OverpassApiObject = BuildApi();
		const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

		const result = await api.execJson(
			(s: OverpassState) => [
				s[OverpassQueryTarget.NodeWayRelation].query((b) => [
					["admin_level", "2"],
					["capital", b.not.equals("yes")],
				]),
			],
			ONLY_IDS,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(URUGUAY_ID);
		expect(element.type).toBe("relation");
	});

	it("Should fetch queries with negated exists", async () => {
		const api: OverpassApiObject = BuildApi();
		const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

		const result = await api.execJson(
			(s: OverpassState) => [
				s[OverpassQueryTarget.NodeWayRelation].query((b) => [
					["admin_level", "2"],
					["capital", b.exists().not()],
				]),
			],
			ONLY_IDS,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(URUGUAY_ID);
		expect(element.type).toBe("relation");
	});

	it("Should fetch queries with reversed negated exists", async () => {
		const api: OverpassApiObject = BuildApi();
		const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

		const result = await api.execJson(
			(s: OverpassState) => [
				s[OverpassQueryTarget.NodeWayRelation].query((b) => [
					["admin_level", "2"],
					["capital", b.not.exists()],
				]),
			],
			ONLY_IDS,
			settings,
		);

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(URUGUAY_ID);
		expect(element.type).toBe("relation");
	});

	it("Should fetch queries with negated regexp", async () => {
		const api: OverpassApiObject = BuildApi();
		const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

		const result = await api.execJson(
			(s: OverpassState) => [
				s[OverpassQueryTarget.NodeWayRelation].query((b) => [
					["name", "Montevideo"],
					["admin_level", b.exists()],
					["admin_level", b.regExp(/^2$/).not()],
				]),
			],
			ONLY_IDS,
			settings,
		);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([MDEO_DEP_ID, MDEO_CITY_ID]);
	});

	it("Should fetch queries with reversed negated regexp", async () => {
		const api: OverpassApiObject = BuildApi();
		const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

		const result = await api.execJson(
			(s: OverpassState) => [
				s[OverpassQueryTarget.NodeWayRelation].query((b) => [
					["name", "Montevideo"],
					["admin_level", b.exists()],
					["admin_level", b.not.regExp(/^2$/)],
				]),
			],
			ONLY_IDS,
			settings,
		);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([MDEO_DEP_ID, MDEO_CITY_ID]);
	});

	it("Should fetch queries with multi filters", async () => {
		const api: OverpassApiObject = BuildApi();
		const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

		const result = await api.execJson(
			(s: OverpassState) => [s.relation.query(() => ({ name: [/^Monte/, /tevi/, /video$/] }))],
			ONLY_IDS,
			settings,
		);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([MDEO_DEP_ID, MDEO_CITY_ID]);
	});
});
