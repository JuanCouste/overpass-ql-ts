import { Symetric } from "?/utils";
import { BooleanParamCompiledItem } from "@/imp";
import { CompiledItem, OverpassExpression } from "@/model";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

function BuildBoolean(value: OverpassExpression<boolean>): CompiledItem<boolean> {
	return new BooleanParamCompiledItem(value);
}

export function parametersBooleanTests() {
	it("Should be fine when booleans are fine", () => ExpectCompileResolves(BuildBoolean, [Symetric.Bool(true)]));

	it(`Should error when booleans are nullish`, () => {
		ExpectCompileRejects(BuildBoolean, [Symetric.Bool(null!)]);
		ExpectCompileRejects(BuildBoolean, [Symetric.Bool(undefined!)]);
	});

	it("Should error when parameter is not a boolean", () =>
		ExpectCompileRejects(BuildBoolean, [Symetric.Bool("" as unknown as boolean)]));
}
