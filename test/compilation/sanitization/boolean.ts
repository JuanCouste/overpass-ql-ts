import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { Symetric } from "?/utils";
import { OverpassCompileUtils } from "@/imp";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

export function sanitizationBooleanTests() {
	it("Should be fine when booleans are fine", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileResolves((value) => utils.boolean(value), [Symetric.Bool(true)]);
	});

	Array<boolean>(null!, undefined!).forEach((number) => {
		it(`Should error when booleans is ${number}`, async () => {
			const utils = new OverpassCompileUtils(NO_SANITIZER);

			await ExpectCompileRejects((value) => utils.boolean(value), [Symetric.Bool(number)]);
		});
	});

	it("Should error when parameter is not a boolean", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileRejects((value) => utils.boolean(value), [Symetric.Bool("" as unknown as boolean)]);
	});
}
