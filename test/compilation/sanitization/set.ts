import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { Symetric } from "?/utils";
import { OverpassCompileUtils } from "@/imp";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

export function parametersSetTests() {
	it("Should be fine when sets are fine", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileResolves((value) => utils.set(value), [Symetric.String("aSet")]);
	});

	it("Should error when sets are undefined", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileRejects((value) => utils.set(value), [Symetric.String(undefined!)]);
	});

	it("Should error when sets are null", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileRejects((value) => utils.set(value), [Symetric.String(null!)]);
	});

	it("Should error when parameter is not a set", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileRejects((value) => utils.set(value), [Symetric.String(/name/ as unknown as string)]);
	});
}
