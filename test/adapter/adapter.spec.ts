import "../setup/checkConnection";
//
import { describe } from "@jest/globals";
import fetchFn from "node-fetch";
import {
	FetchFunction,
	FetchRequestAdapter,
	NodeHttpRequestAdapter,
	XMLHttpRequestAdapter,
	XMLHttpRequestConstructor,
} from "../../src/imp/api/request";
import { adapterSpecificTests } from "./adapter";
import { creationTests } from "./creation";

// do not use @types/xmlhttprequest ...
// @ts-ignore
import { XMLHttpRequest } from "xmlhttprequest";

describe("Adapter", () => {
	describe("Creation", creationTests);
	describe("NodeHttp", () => adapterSpecificTests(() => new NodeHttpRequestAdapter()));
	describe("XMLHttp", () =>
		adapterSpecificTests(() => new XMLHttpRequestAdapter(XMLHttpRequest as unknown as XMLHttpRequestConstructor)));
	describe("Fetch", () => adapterSpecificTests(() => new FetchRequestAdapter(fetchFn as unknown as FetchFunction)));
});
