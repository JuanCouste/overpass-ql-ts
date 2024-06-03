import { NOT_AN_API } from "?/utils";
import { FetchRequestAdapter, NodeHttpRequestAdapter, XMLHttpRequestAdapter } from "@/imp";
import {
	DefaultOverpassApi,
	FetchOverpassApi,
	HttpOverpassApi,
	OverpassApiObject,
	OverpassApiObjectImp,
	RequestAdapter,
	XMLOverpassApi,
} from "@/index";
import { expect, it } from "@jest/globals";

function expectAdapterToBe(api: OverpassApiObject, adapterClass: new () => RequestAdapter) {
	expect((api as OverpassApiObjectImp).__adapter__).toBeInstanceOf(adapterClass);
}

export function creationTests() {
	const partialGlobal = globalThis as Partial<typeof globalThis>;
	const fetchFn = (() => {}) as unknown as typeof fetch;
	const XmlClass = class {} as typeof XMLHttpRequest;

	delete partialGlobal.fetch;
	delete partialGlobal.XMLHttpRequest;

	it(`Should create an api with ${FetchRequestAdapter.name}`, () => {
		globalThis.fetch = fetchFn;

		expectAdapterToBe(FetchOverpassApi({ interpreterUrl: NOT_AN_API }), FetchRequestAdapter);

		delete partialGlobal.fetch;
	});

	it(`Should create an api with ${XMLHttpRequestAdapter.name}`, () =>
		expectAdapterToBe(XMLOverpassApi({ interpreterUrl: NOT_AN_API }), XMLHttpRequestAdapter));

	it(`Should create an api with ${NodeHttpRequestAdapter.name}`, () =>
		expectAdapterToBe(HttpOverpassApi({ interpreterUrl: NOT_AN_API }), NodeHttpRequestAdapter));

	it("Should create an api with fetch", () => {
		globalThis.fetch = fetchFn;

		expectAdapterToBe(FetchOverpassApi({ interpreterUrl: NOT_AN_API }), FetchRequestAdapter);

		delete partialGlobal.fetch;
	});

	it(`Should create ${NodeHttpRequestAdapter.name} by default`, () =>
		expectAdapterToBe(DefaultOverpassApi({ interpreterUrl: NOT_AN_API }), NodeHttpRequestAdapter));

	it(`Should create ${XMLHttpRequestAdapter.name} when aviable`, () => {
		globalThis.XMLHttpRequest = XmlClass;

		expectAdapterToBe(DefaultOverpassApi({ interpreterUrl: NOT_AN_API }), XMLHttpRequestAdapter);

		delete partialGlobal.XMLHttpRequest;
	});

	it(`Should create ${FetchRequestAdapter.name} when aviable`, () => {
		globalThis.fetch = fetchFn;

		expectAdapterToBe(DefaultOverpassApi({ interpreterUrl: NOT_AN_API }), FetchRequestAdapter);

		delete partialGlobal.fetch;
	});

	it(`Should prefer ${FetchRequestAdapter.name} if possible`, () => {
		globalThis.fetch = fetchFn;
		globalThis.XMLHttpRequest = XmlClass;

		expectAdapterToBe(DefaultOverpassApi({ interpreterUrl: NOT_AN_API }), FetchRequestAdapter);

		delete partialGlobal.fetch;
		delete partialGlobal.XMLHttpRequest;
	});
}
