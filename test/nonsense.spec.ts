import { OverpassStateImp } from "@/imp";
import { OverpassError } from "@/index";
import { beforeAll, describe, expect, it } from "@jest/globals";
import * as fs from "fs/promises";

describe("Nonsense", () => {
	let major: number = NaN;

	beforeAll(async () => {
		const { version } = JSON.parse(await fs.readFile("./package.json", "utf-8"));

		major = +version.split(".")[0];
	});

	it("Should not affect coverage", async () => {
		new OverpassError(0);
	});

	it("Was deprecated and changed name, currently an alias until 2.0.0", async () => {
		const warn = console.warn;
		console.warn = () => {};
		new OverpassStateImp(null!, null!, null!).proxy.node.query([]);
		console.warn = warn;

		expect(major).toBeLessThan(2);
	});
});
