import "?/setup/checkConnection";
//
import {
	FetchFunction,
	FetchRequestAdapter,
	HttpRequestMethod,
	NodeHttpRequestAdapter,
	XMLHttpRequestAdapter,
	XMLHttpRequestConstructor,
} from "@/imp";
import { OverpassError, OverpassErrorType } from "@/model";
import { describe, expect, it } from "@jest/globals";
import { ClientRequest, IncomingMessage } from "http";
import fetchFn from "node-fetch";
import { adapterSpecificTests } from "./adapter";
import { creationTests } from "./creation";

// do not use @types/xmlhttprequest ...
// @ts-ignore
import { XMLHttpRequest } from "xmlhttprequest";

describe("Adapter", () => {
	describe("Creation", creationTests);
	describe("NodeHttp", () => {
		adapterSpecificTests(() => new NodeHttpRequestAdapter());

		it("Should handle null statusCode", async () => {
			const method: HttpRequestMethod = () =>
				({
					on(event, callback: (response: IncomingMessage) => void) {
						if (event == "response")
							callback({
								on(event: string, callback: () => void) {
									if (event == "end") callback();
								},
							} as IncomingMessage);
					},
				}) as ClientRequest;

			const adapter = new NodeHttpRequestAdapter([method, method]);
			const promise = adapter.request(new URL("https://localhost"));

			await expect(promise).rejects.toThrow(OverpassError);
			await expect(promise).rejects.toHaveProperty("type", OverpassErrorType.NetworkError);
		});
	});
	describe("XMLHttp", () =>
		adapterSpecificTests(() => new XMLHttpRequestAdapter(XMLHttpRequest as unknown as XMLHttpRequestConstructor)));
	describe("Fetch", () => adapterSpecificTests(() => new FetchRequestAdapter(fetchFn as unknown as FetchFunction)));
});
