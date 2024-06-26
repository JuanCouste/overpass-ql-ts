import "./checkConnection";
//
import { OverpassApiObject, OverpassQueryTarget, OverpassSettings, OverpassState } from "@/index";
import { describe, expect, it } from "@jest/globals";
import { BuildApi, MDEO_BBOX, MDEO_CITY_ID, MDEO_DEP_ID, MDEO_ID, ONLY_IDS, URUGUAY_ID } from "./utils";

/** For information regarding tests see /test/README.md */

describe("Query", () => {
	it("Should fetch queries with string values", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson(
			(s: OverpassState) => [s.node.byTags({ name: "Montevideo", capital: "yes" })],
			ONLY_IDS,
			{ globalBoundingBox: MDEO_BBOX },
		);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should fetch queries with filter objects", async () => {
		const api: OverpassApiObject = BuildApi();
		const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

		const result = await api.execJson(
			(s: OverpassState) => [
				s.node.byTags((b) => ({
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
				s.node.byTags((b) => [
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

		const { elements } = await api.execJson(
			(s: OverpassState) => [s.node.byTags({ name: /^Montevideo$/, capital: /^yes$/ })],
			ONLY_IDS,
			{ globalBoundingBox: MDEO_BBOX },
		);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should fetch half regexp queries", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson(
			(s: OverpassState) => [s.node.byTags({ name: /ontevide/, capital: /es$/ })],
			ONLY_IDS,
			{ globalBoundingBox: MDEO_BBOX },
		);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should fetch regexp tuples", async () => {
		const api: OverpassApiObject = BuildApi();
		const settings: OverpassSettings = { globalBoundingBox: MDEO_BBOX };

		const result = await api.execJson(
			(s: OverpassState) => [
				s.node.byTags((b) => [
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
				s.node.byTags(() => [
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
				s.node.byTags((b) => ({
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
				s[OverpassQueryTarget.NodeWayRelation].byTags((b) => [
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
				s[OverpassQueryTarget.NodeWayRelation].byTags((b) => [
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
				s[OverpassQueryTarget.NodeWayRelation].byTags((b) => [
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
				s[OverpassQueryTarget.NodeWayRelation].byTags((b) => [
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
				s[OverpassQueryTarget.NodeWayRelation].byTags((b) => [
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
				s[OverpassQueryTarget.NodeWayRelation].byTags((b) => [
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
			(s: OverpassState) => [s.relation.byTags(() => ({ name: [/^Monte/, /tevi/, /video$/] }))],
			ONLY_IDS,
			settings,
		);

		expect(result.elements.length).toBe(2);

		const ids = result.elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([MDEO_DEP_ID, MDEO_CITY_ID]);
	});
});
