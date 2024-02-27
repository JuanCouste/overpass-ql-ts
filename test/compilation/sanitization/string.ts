import { Symetric } from "?/utils";
import { OverpassCompileUtils } from "@/imp";
import { describe, it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

export function sanitizationStringTests() {
	describe("Quoted", () => {
		it("Should be fine when strings are fine", async () => {
			const utils = new OverpassCompileUtils();

			await ExpectCompileResolves((value) => utils.qString(value), [Symetric.String("aValue")]);
		});

		it("Should error when strings are undefined", async () => {
			const utils = new OverpassCompileUtils();

			await ExpectCompileRejects((value) => utils.qString(value), [Symetric.String(undefined!)]);
		});

		it("Should error when strings are null", async () => {
			const utils = new OverpassCompileUtils();

			await ExpectCompileRejects((value) => utils.qString(value), [Symetric.String(null!)]);
		});

		it("Should error when parameter is not a string", async () => {
			const utils = new OverpassCompileUtils();

			await ExpectCompileRejects((value) => utils.qString(value), [Symetric.String(/name/ as unknown as string)]);
		});
	});

	describe("Unquoted", () => {
		it("Should be fine when strings are fine", async () => {
			const utils = new OverpassCompileUtils();

			await ExpectCompileResolves((value) => utils.string(value), [Symetric.String("aValue")]);
		});

		it("Should error when strings are undefined", async () => {
			const utils = new OverpassCompileUtils();

			await ExpectCompileRejects((value) => utils.string(value), [Symetric.String(undefined!)]);
		});

		it("Should error when strings are null", async () => {
			const utils = new OverpassCompileUtils();

			await ExpectCompileRejects((value) => utils.string(value), [Symetric.String(null!)]);
		});

		it("Should error when parameter is not a string", async () => {
			const utils = new OverpassCompileUtils();

			await ExpectCompileRejects((value) => utils.string(value), [Symetric.String(/name/ as unknown as string)]);
		});
	});
}
