import { expect } from "@jest/globals";
import { HttpResponse, OverpassJsonOutput, OverpassParameterError, RequestAdapter } from "../../src";
import { APP_JSON, JSON_OUTPUT, buildApi } from "../utils";

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
	return buildApi(() => sanitizationAdapter);
}

export async function ExpectParamteterError(result: Promise<OverpassJsonOutput>): Promise<void> {
	await expect(result).rejects.toThrow(OverpassParameterError);
}
