import { Symetric } from "?/utils";
import { DateParamCompiledItem } from "@/imp";
import { CompiledItem, OverpassExpression } from "@/model";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

function BuildDate(value: OverpassExpression<Date>): CompiledItem<Date> {
	return new DateParamCompiledItem(value);
}

export function parametersDateTests() {
	it("Should be fine when Dates are fine", async () =>
		await ExpectCompileResolves(BuildDate, [Symetric.Date(new Date(2000, 2))]));

	it(`Should error when Dates are nullish`, async () => {
		await ExpectCompileRejects(BuildDate, [Symetric.Date(null!)]);
		await ExpectCompileRejects(BuildDate, [Symetric.Date(undefined!)]);
	});

	it("Should error when parameter is not a Date", async () =>
		await ExpectCompileRejects(BuildDate, [Symetric.Date(new Date(2000, 2).toISOString() as unknown as Date)]));

	it("Should error when dates are invalid", async () =>
		await ExpectCompileRejects(BuildDate, [Symetric.Date(new Date(NaN) as unknown as Date)]));
}
