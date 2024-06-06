import { OverpassApiObjectImp, OverpassStateImp } from "@/imp";
import { OverpassError } from "@/index";
import { beforeAll, describe, expect, it } from "@jest/globals";
import * as fs from "fs/promises";
import { NOT_AN_API } from "./utils";

/** For information regarding tests see /test/README.md */

describe("Nonsense", () => {
	it("Should not affect coverage", async () => {
		new OverpassError(0);
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

	it("Should not contain OverpassTargetState after 2.0.0", async () => {
		console.warn = noWarn;
		new OverpassStateImp(null!, null!, null!).proxy.node.query([]);
		console.warn = warn;

		expect(major).toBeLessThan(2);
	});

	it("Should not contain OverpassApiObjectImp.Build after 2.0.0", async () => {
		console.warn = noWarn;
		OverpassApiObjectImp.Build(null!, NOT_AN_API);
		console.warn = warn;

		expect(major).toBeLessThan(2);
	});

	it("Should not contain OverpassApiObjectImp.InterpreterUrlFrom after 2.0.0", async () => {
		console.warn = noWarn;
		OverpassApiObjectImp.InterpreterUrlFrom(NOT_AN_API);
		console.warn = warn;

		expect(major).toBeLessThan(2);
	});

	it("Should not contain OverpassApiObjectImp.StatusUrlFrom after 2.0.0", async () => {
		console.warn = noWarn;
		OverpassApiObjectImp.StatusUrlFrom(NOT_AN_API);
		console.warn = warn;

		expect(major).toBeLessThan(2);
	});

	it("Should not contain OverpassApiObjectImp.StatusUrlFromInterpreterUrl after 2.0.0", async () => {
		console.warn = noWarn;
		OverpassApiObjectImp.StatusUrlFromInterpreterUrl(NOT_AN_API);
		console.warn = warn;

		expect(major).toBeLessThan(2);
	});
}
