import "?/checkConnection";
//
import { BuildApi } from "?/utils";
import {
	BuildOverpassApi,
	GetSanitizer,
	InterpreterUrlFrom,
	NaiveOverpassStringSanitizer,
	NoOverpassStringSanitizer,
	StatusUrlFrom,
} from "@/imp";
import { OverpassApiObject } from "@/model";
import { describe, expect, it } from "@jest/globals";
import { apiFormatTests } from "./format";
import { apiMethodsTests } from "./methods";
import { apiOutOptionsTests } from "./options";
import { apiSettingsTests } from "./settings";

describe("Api", () => {
	describe("Format", apiFormatTests);
	describe("Settings", apiSettingsTests);
	describe("Methods", apiMethodsTests);
	describe("Options", apiOutOptionsTests);

	it("Should handle empty queries", async () => {
		const api: OverpassApiObject = BuildApi();

		const promise = (async () => await api.execJson(() => []))();

		await expect(promise).rejects.toThrow(Error);
	});

	it("Should expect a status url if interpreter is custom", () => {
		expect(() => BuildOverpassApi(null!, { interpreterUrl: "http://localhost/custom" })).toThrow(Error);
	});

	it("Should create status url from string", () => {
		const url = StatusUrlFrom(null!, "http://localhost");

		expect(url).toEqual(new URL("http://localhost"));
	});

	it("Should create status url from url", () => {
		const url = StatusUrlFrom(null!, new URL("http://localhost"));

		expect(url).toEqual(new URL("http://localhost"));
	});

	it("Should default to main instance", () => {
		const url = InterpreterUrlFrom();

		expect(url.host).toEqual("overpass-api.de");
	});

	it("Should allow for using custom sanitizer", () => {
		const sanitizer = new NoOverpassStringSanitizer();
		expect(GetSanitizer(sanitizer)).toBe(sanitizer);
	});

	it("Should default to no sanitization", () => {
		expect(GetSanitizer(false)).toBeInstanceOf(NoOverpassStringSanitizer);
		expect(GetSanitizer(undefined)).toBeInstanceOf(NoOverpassStringSanitizer);
	});

	it("Should use sanitization when specified", () => {
		expect(GetSanitizer(true)).toBeInstanceOf(NaiveOverpassStringSanitizer);
	});
});
