import { expect, it } from "@jest/globals";
import {
	HttpResponse,
	OverpassErrorType,
	OverpassFormat,
	OverpassJsonSettings,
	OverpassOutputOptions,
	OverpassQueryError,
	OverpassRemarkError,
	OverpassSettings,
} from "../../src";
import { OverpassQueryValidatorImp } from "../../src/imp/api/validator";
import { GetErrorFile, TEXT_HTML_CH, TEXT_PLAIN } from "../utils";

async function validateHttpResult(result: HttpResponse) {
	const validator = new OverpassQueryValidatorImp(new URL("http://localhost"));

	return validator.validate<OverpassJsonSettings<OverpassSettings>, OverpassOutputOptions>(
		"",
		result,
		OverpassFormat.JSON,
	);
}

async function validateHtmlRemark(html: string) {
	return validateHttpResult({ status: 200, contentType: TEXT_HTML_CH, response: html });
}

export function apiValidatorErrorTests() {
	it("Should handle duplicate query error", async () => {
		const duplicateQuery = await GetErrorFile("duplicateQuery.html");

		const resultPromise = validateHtmlRemark(duplicateQuery);

		await expect(resultPromise).rejects.toThrow(OverpassRemarkError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.DuplicateQuery);
	});

	it("Should handle too many requests error", async () => {
		const rateLimited = await GetErrorFile("rateLimited.html");

		const resultPromise = validateHttpResult({ status: 429, contentType: TEXT_HTML_CH, response: rateLimited });

		await expect(resultPromise).rejects.toThrowError(OverpassQueryError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.TooManyRequests);
	});

	it("Should handle too many requests error", async () => {
		const badRequest = await GetErrorFile("badRequest.html");

		const resultPromise = validateHttpResult({ status: 400, contentType: TEXT_HTML_CH, response: badRequest });

		await expect(resultPromise).rejects.toThrowError(OverpassQueryError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.QueryError);
	});

	it("Should handle server error", async () => {
		const resultPromise = validateHttpResult({ status: 500, contentType: TEXT_PLAIN, response: "Server error" });

		await expect(resultPromise).rejects.toThrowError(OverpassQueryError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.ServerError);
	});

	it("Should handle unexpected status", async () => {
		const resultPromise = validateHttpResult({ status: 300, contentType: TEXT_PLAIN, response: "Redirect" });

		await expect(resultPromise).rejects.toThrowError(OverpassQueryError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.UnknownError);
	});

	it("Should handle unexpected missing colon", async () => {
		const unexpected = await GetErrorFile("unexpected.html");

		const resultPromise = validateHttpResult({ status: 400, contentType: TEXT_HTML_CH, response: unexpected });

		await expect(resultPromise).rejects.toThrowError(OverpassQueryError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.QueryError);
	});

	it("Should handle unexpected missing colon in 200", async () => {
		const unexpected = await GetErrorFile("unexpected.html");

		const resultPromise = validateHttpResult({ status: 200, contentType: TEXT_HTML_CH, response: unexpected });

		await expect(resultPromise).rejects.toThrowError(OverpassRemarkError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.QueryError);
	});

	it("Should handle missing content type 200", async () => {
		const resultPromise = validateHttpResult({ status: 200, contentType: undefined, response: "" });

		await expect(resultPromise).rejects.toThrowError(OverpassQueryError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.UnknownError);
	});
}
