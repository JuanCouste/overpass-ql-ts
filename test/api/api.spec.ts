import "../setup/checkConnection";
//
import { describe, expect, it } from "@jest/globals";
import { OverpassApiObject, OverpassApiObjectImp } from "../../src";
import { buildApi } from "../setup/apiBuilder";
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
		const api: OverpassApiObject = buildApi();

		const promise = (async () => await api.execJson(() => []))();

		await expect(promise).rejects.toThrow(Error);
	});

	it("Should expect a status url if interpreter is custom", () => {
		expect(() => OverpassApiObjectImp.Build(null!, "http://localhost/custom")).toThrow(Error);
	});
});
