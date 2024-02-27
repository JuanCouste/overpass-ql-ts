import { HttpResponse, OverpassJsonOutput, RequestAdapter } from "@/index";
import { BuildApi } from "./api";
import { APP_JSON } from "./contentType";
import { JSON_OUTPUT } from "./ids";

export const StaticHttpResponse: HttpResponse = {
	status: 200,
	contentType: APP_JSON,
	response: (function () {
		const json: OverpassJsonOutput = { ...JSON_OUTPUT, elements: [] };
		return JSON.stringify(json);
	})(),
};

const staticAdapter: RequestAdapter = {
	request() {
		return Promise.resolve(StaticHttpResponse);
	},
};

export function StaticAdapter() {
	return BuildApi(() => staticAdapter);
}
