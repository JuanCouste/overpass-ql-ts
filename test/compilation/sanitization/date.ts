import { Symetric } from "?/utils";
import { OverpassCompileUtils } from "@/imp";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

export function sanitizationDateTests() {
	it("Should be fine when Dates are fine", async () => {
		const utils = new OverpassCompileUtils();

		await ExpectCompileResolves((value) => utils.date(value), [Symetric.Date(new Date(2000, 2))]);
	});

	it("Should error when Dates are undefined", async () => {
		const utils = new OverpassCompileUtils();

		await ExpectCompileRejects((value) => utils.date(value), [Symetric.Date(undefined!)]);
	});

	it("Should error when Dates are null", async () => {
		const utils = new OverpassCompileUtils();

		await ExpectCompileRejects((value) => utils.date(value), [Symetric.Date(null!)]);
	});

	it("Should error when parameter is not a Date", async () => {
		const utils = new OverpassCompileUtils();

		await ExpectCompileRejects(
			(value) => utils.date(value),
			[Symetric.Date(new Date(2000, 2).toISOString() as unknown as Date)],
		);
	});

	it("Should error when dates are invalid", async () => {
		const utils = new OverpassCompileUtils();

		await ExpectCompileRejects((value) => utils.date(value), [Symetric.Date(new Date(NaN) as unknown as Date)]);
	});
}
