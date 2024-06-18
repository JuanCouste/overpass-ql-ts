import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { Symetric } from "?/utils";
import { OverpassCompileUtils } from "@/imp";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

export function parametersStringTests() {
	it("Should be fine when strings are fine", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileResolves((value) => utils.qString(value), [Symetric.String("aValue")]);
	});

	it("Should error when strings are undefined", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileRejects((value) => utils.qString(value), [Symetric.String(undefined!)]);
	});

	it("Should error when strings are null", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileRejects((value) => utils.qString(value), [Symetric.String(null!)]);
	});

	it("Should error when parameter is not a string", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileRejects((value) => utils.qString(value), [Symetric.String(/name/ as unknown as string)]);
	});
}
