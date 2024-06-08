import {
	BuildOverpassApi,
	DefaultOverpassApi,
	FetchOverpassApi,
	HttpOverpassApi,
	OverpassApiObjectImp,
	OverpassStateImp,
	XMLOverpassApi,
} from "@/imp";
import { OverpassError } from "@/index";
import { beforeAll, describe, expect, it } from "@jest/globals";
import * as fs from "fs/promises";
import { NOT_AN_API } from "./utils";

/** For information regarding tests see /test/README.md */

describe("Nonsense", () => {
	it("Should not affect coverage", () => {
		new OverpassError(0);
		BuildOverpassApi(null!);
	});

	describe("Deprecation", deprecationTests);
});

function deprecationTests() {
	let major: number = NaN;

	beforeAll(async () => {
		const { version } = JSON.parse(await fs.readFile("./package.json", "utf-8"));

		major = +version.split(".")[0];
	});

	const warn = console.warn;
	const noWarn = () => undefined;

	it("Should not contain OverpassTargetState.query after 2.0.0", () => {
		console.warn = noWarn;
		new OverpassStateImp(null!, null!, null!).proxy.node.query([]);
		console.warn = warn;

		expect(major).toBeLessThan(2);
	});

	it("Should not contain OverpassApiObjectImp.Build after 2.0.0", () => {
		console.warn = noWarn;
		OverpassApiObjectImp.Build(null!, NOT_AN_API);
		console.warn = warn;

		expect(major).toBeLessThan(2);
	});

	it("Should not contain OverpassApiObjectImp.InterpreterUrlFrom after 2.0.0", () => {
		console.warn = noWarn;
		OverpassApiObjectImp.InterpreterUrlFrom(NOT_AN_API);
		console.warn = warn;

		expect(major).toBeLessThan(2);
	});

	it("Should not contain OverpassApiObjectImp.StatusUrlFrom after 2.0.0", () => {
		console.warn = noWarn;
		OverpassApiObjectImp.StatusUrlFrom(NOT_AN_API);
		console.warn = warn;

		expect(major).toBeLessThan(2);
	});

	it("Should not contain OverpassApiObjectImp.StatusUrlFromInterpreterUrl after 2.0.0", () => {
		console.warn = noWarn;
		OverpassApiObjectImp.StatusUrlFromInterpreterUrl(NOT_AN_API);
		console.warn = warn;

		expect(major).toBeLessThan(2);
	});

	it("Should not contain HttpOverpassApi(string | URL, string | URL) after 2.0.0", () => {
		console.warn = noWarn;
		HttpOverpassApi(NOT_AN_API, NOT_AN_API);
		console.warn = warn;

		expect(major).toBeLessThan(2);
	});

	it("Should not contain FetchOverpassApi(string | URL, string | URL) after 2.0.0", () => {
		const partialGlobal = globalThis as Partial<typeof globalThis>;
		const fetchFn = (() => {}) as unknown as typeof fetch;

		console.warn = noWarn;
		globalThis.fetch = fetchFn;
		FetchOverpassApi(NOT_AN_API, NOT_AN_API);
		delete partialGlobal.fetch;
		console.warn = warn;

		expect(major).toBeLessThan(2);
	});

	it("Should not contain XMLOverpassApi(string | URL, string | URL) after 2.0.0", () => {
		console.warn = noWarn;
		XMLOverpassApi(NOT_AN_API, NOT_AN_API);
		console.warn = warn;

		expect(major).toBeLessThan(2);
	});

	it("Should not contain DefaultOverpassApi(string | URL, string | URL) after 2.0.0", () => {
		console.warn = noWarn;
		DefaultOverpassApi(NOT_AN_API, NOT_AN_API);
		console.warn = warn;

		expect(major).toBeLessThan(2);
	});
}
