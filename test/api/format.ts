import { BuildApi, ONLY_IDS, URUGUAY_ID } from "?/utils";
import { CSVField, OverpassApiObject, OverpassCSVSettings, OverpassFormat } from "@/index";
import { describe, expect, it } from "@jest/globals";
import { uruguayStatementBuilder } from "./uruguay";

export function apiFormatTests() {
	it("Should run xml queries", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.exec({ format: OverpassFormat.XML }, uruguayStatementBuilder, ONLY_IDS);

		expect(typeof result).toBe("string");

		expect(result).toMatch("<?xml");
	});

	describe("CSV", () => {
		it("Should run csv queries", async () => {
			const api: OverpassApiObject = BuildApi();
			const delimiter = "|-|";
			const settings: OverpassCSVSettings = {
				format: OverpassFormat.CSV,
				csvSettings: {
					fields: [CSVField.Id, "name"],
					delimiterCharacter: delimiter,
					headerLine: true,
				},
			};

			const result = await api.exec(settings, uruguayStatementBuilder, ONLY_IDS);

			expect(typeof result).toBe("string");

			const [labels, uruguayRow] = result
				.trim()
				.split("\n")
				.map((line) => line.trim().split(delimiter));

			expect(labels).toEqual(["@id", "name"]);
			expect(+uruguayRow[0]).toEqual(URUGUAY_ID);
		});

		it("Should run csv queries without delimiter", async () => {
			const api: OverpassApiObject = BuildApi();
			const settings: OverpassCSVSettings = {
				format: OverpassFormat.CSV,
				csvSettings: {
					fields: [CSVField.Id, "name"],
					headerLine: true,
				},
			};

			const result = await api.exec(settings, uruguayStatementBuilder, ONLY_IDS);

			expect(typeof result).toBe("string");

			const [labels, uruguayRow] = result
				.trim()
				.split("\n")
				.map((line) => line.trim().split("\t"));

			expect(labels).toEqual(["@id", "name"]);
			expect(+uruguayRow[0]).toEqual(URUGUAY_ID);
		});

		it("Should run csv queries without delimiter and headerline", async () => {
			const api: OverpassApiObject = BuildApi();
			const settings: OverpassCSVSettings = {
				format: OverpassFormat.CSV,
				csvSettings: { fields: [CSVField.Id, "name"] },
			};

			const result = await api.exec(settings, uruguayStatementBuilder, ONLY_IDS);

			expect(typeof result).toBe("string");

			const [labels, uruguayRow] = result
				.trim()
				.split("\n")
				.map((line) => line.trim().split("\t"));

			expect(labels).toEqual(["@id", "name"]);
			expect(+uruguayRow[0]).toEqual(URUGUAY_ID);
		});

		it("Should run csv queries with headerline false", async () => {
			const api: OverpassApiObject = BuildApi();
			const settings: OverpassCSVSettings = {
				format: OverpassFormat.CSV,
				csvSettings: { fields: [CSVField.Id, "name"], headerLine: false },
			};

			const result = await api.exec(settings, uruguayStatementBuilder, ONLY_IDS);

			expect(typeof result).toBe("string");

			const [uruguayRow] = result
				.trim()
				.split("\n")
				.map((line) => line.trim().split("\t"));

			expect(+uruguayRow[0]).toEqual(URUGUAY_ID);
		});

		it("Should run csv queries with delimiter", async () => {
			const api: OverpassApiObject = BuildApi();
			const delimiter = "|-|";
			const settings: OverpassCSVSettings = {
				format: OverpassFormat.CSV,
				csvSettings: { fields: [CSVField.Id, "name"], delimiterCharacter: delimiter },
			};

			const result = await api.exec(settings, uruguayStatementBuilder, ONLY_IDS);

			expect(typeof result).toBe("string");

			const [labels, uruguayRow] = result
				.trim()
				.split("\n")
				.map((line) => line.trim().split(delimiter));

			expect(labels).toEqual(["@id", "name"]);
			expect(+uruguayRow[0]).toEqual(URUGUAY_ID);
		});

		it("Should not run csv queries with csvSettings", async () => {
			const api: OverpassApiObject = BuildApi();
			const settings: OverpassCSVSettings = { format: OverpassFormat.CSV } as OverpassCSVSettings;

			const result = api.exec(settings, uruguayStatementBuilder, ONLY_IDS);

			expect(result).rejects.toThrow();
		});
	});
}
