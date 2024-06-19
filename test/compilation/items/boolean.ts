import { Symetric } from "?/utils";
import { BooleanParamCompiledItem } from "@/imp";
import { CompiledItem, OverpassExpression } from "@/model";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

function BuildBoolean(value: OverpassExpression<boolean>): CompiledItem<boolean> {
	return new BooleanParamCompiledItem(value);
}

export function parametersBooleanTests() {
	it("Should be fine when booleans are fine", async () =>
		await ExpectCompileResolves(BuildBoolean, [Symetric.Bool(true)]));

	it(`Should error when booleans are nullish`, async () => {
		await ExpectCompileRejects(BuildBoolean, [Symetric.Bool(null!)]);
		await ExpectCompileRejects(BuildBoolean, [Symetric.Bool(undefined!)]);
	});

	it("Should error when parameter is not a boolean", async () =>
		await ExpectCompileRejects(BuildBoolean, [Symetric.Bool("" as unknown as boolean)]));
}
