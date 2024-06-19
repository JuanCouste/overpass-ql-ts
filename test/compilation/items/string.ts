import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { Symetric } from "?/utils";
import { StringParamCompiledItem } from "@/imp";
import { CompiledItem, OverpassExpression } from "@/model";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

function BuildString(value: OverpassExpression<string>): CompiledItem<string> {
	return new StringParamCompiledItem(NO_SANITIZER, value);
}

export function parametersStringTests() {
	it("Should be fine when strings are fine", () => ExpectCompileResolves(BuildString, [Symetric.String("aValue")]));

	it(`Should error when strings are nullish`, () => {
		ExpectCompileRejects(BuildString, [Symetric.String(null!)]);
		ExpectCompileRejects(BuildString, [Symetric.String(undefined!)]);
	});

	it("Should error when parameter is not a string", () =>
		ExpectCompileRejects(BuildString, [Symetric.String(/name/ as unknown as string)]));
}
