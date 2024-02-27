import { BuildApi, MDEO_BBOX, MDEO_ID, ONLY_IDS } from "?/utils";
import { OverpassApiObject, OverpassErrorType, OverpassFormat, OverpassRemarkError } from "@/index";
import { expect, it } from "@jest/globals";
import { asyncExpectUruguay, uruguayStatementBuilder } from "./uruguay";

export function apiSettingsTests() {
	it("Should run timeout queries", async () => {
		const api = BuildApi();

		const result = api.execJson(uruguayStatementBuilder, ONLY_IDS, { timeout: 12345 });

		await asyncExpectUruguay(result);
	});

	it("Should run date queries", async () => {
		const api = BuildApi();

		const promise = api.execJson(uruguayStatementBuilder, ONLY_IDS, { date: new Date(Date.UTC(2000, 1, 2)) });

		await expect(promise).rejects.toThrow(OverpassRemarkError);
		await expect(promise).rejects.toHaveProperty("type", OverpassErrorType.NoAtticData);
	});

	it("Should run diff queries", async () => {
		const api: OverpassApiObject = BuildApi();

		const promise = api.exec(
			{
				format: OverpassFormat.XML,
				diff: [new Date(Date.UTC(2000, 1, 2)), new Date(Date.UTC(2003, 4, 5))],
			},
			uruguayStatementBuilder,
			ONLY_IDS,
		);

		await expect(promise).rejects.toThrow(OverpassRemarkError);
		await expect(promise).rejects.toHaveProperty("type", OverpassErrorType.NoAtticData);
	});

	it("Should run queries with no settings", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.exec({}, uruguayStatementBuilder, ONLY_IDS);

		expect(typeof result).toBe("string");

		expect(result).toMatch("<?xml");
	});

	it("Should run queries with maxSize", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = api.execJson(uruguayStatementBuilder, ONLY_IDS, { maxSize: 500 });

		await asyncExpectUruguay(result);
	});

	it("Should run queries with globalBoundingBox", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = api.execJson(
			(s) =>
				s.node.query((b) => [
					["name", b.equals("Montevideo")],
					["capital", b.equals("yes")],
				]),
			ONLY_IDS,
			{ globalBoundingBox: MDEO_BBOX },
		);

		expect(result).resolves.toBeInstanceOf(Object);

		const { elements } = await result;

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});
}
