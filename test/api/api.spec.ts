import "?/checkConnection";
//
import { BuildApi } from "?/utils";
import { OverpassApiObject, OverpassApiObjectImp } from "@/index";
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
		expect(() => OverpassApiObjectImp.Build(null!, "http://localhost/custom")).toThrow(Error);
	});

	it("Should create status url from string", () => {
		const url = OverpassApiObjectImp.StatusUrlFrom(null!, "http://localhost");

		expect(url).toEqual(new URL("http://localhost"));
	});

	it("Should create status url from url", () => {
		const url = OverpassApiObjectImp.StatusUrlFrom(null!, new URL("http://localhost"));

		expect(url).toEqual(new URL("http://localhost"));
	});

	it("Should default to main instance", () => {
		const url = OverpassApiObjectImp.InterpreterUrlFrom();

		expect(url.host).toEqual("overpass-api.de");
	});
});
