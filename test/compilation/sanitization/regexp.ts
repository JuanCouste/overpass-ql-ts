import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { Symetric } from "?/utils";
import { OverpassCompileUtils } from "@/imp";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

export function parametersRegExpTests() {
	it("Should be fine when regexps are fine", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileResolves((value) => utils.regExp(value), [Symetric.RegExp(/aValue/)]);
	});

	it("Should error when regexps are undefined", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileRejects((value) => utils.regExp(value), [Symetric.RegExp(undefined!)]);
	});

	it("Should error when regexps are null", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileRejects((value) => utils.regExp(value), [Symetric.RegExp(null!)]);
	});

	it("Should error when parameter is not a regexp", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileRejects((value) => utils.regExp(value), [Symetric.RegExp("name" as unknown as RegExp)]);
	});
}
