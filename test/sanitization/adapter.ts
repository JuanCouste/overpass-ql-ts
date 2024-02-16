import { expect } from "@jest/globals";
import { HttpResponse, OverpassJsonOutput, OverpassParameterError, RequestAdapter } from "../../src";
import { APP_JSON, BuildApi, JSON_OUTPUT } from "../utils";

const staticResponse: HttpResponse = {
	status: 200,
	contentType: APP_JSON,
	response: (function () {
		const json: OverpassJsonOutput = { ...JSON_OUTPUT, elements: [] };
		return JSON.stringify(json);
	})(),
};

const sanitizationAdapter: RequestAdapter = {
	request() {
		return Promise.resolve(staticResponse);
	},
};

export function SanitizationAdapter() {
	return BuildApi(() => sanitizationAdapter);
}

export async function ExpectParamteterError(result: Promise<OverpassJsonOutput>): Promise<void> {
	await expect(result).rejects.toThrow(OverpassParameterError);
}
