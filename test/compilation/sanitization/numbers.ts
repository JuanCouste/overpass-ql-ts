import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { Symetric } from "?/utils";
import { OverpassCompileUtils } from "@/imp";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

export function sanitizationNumberTests() {
	it("Should be fine when numbers are fine", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileResolves((value) => utils.number(value), [Symetric.Number(1)]);
	});

	Array<number>(NaN, Infinity, null!, undefined!).forEach((number) => {
		it(`Should error when numbers is ${number}`, async () => {
			const utils = new OverpassCompileUtils(NO_SANITIZER);

			await ExpectCompileRejects((value) => utils.number(value), [Symetric.Number(number)]);
		});
	});

	it("Should error when parameter is not a number", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		await ExpectCompileRejects((value) => utils.number(value), [Symetric.Number("1" as unknown as number)]);
	});
}
