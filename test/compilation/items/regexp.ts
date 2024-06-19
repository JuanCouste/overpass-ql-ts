import { Symetric } from "?/utils";
import { RegExpParamCompiledItem } from "@/imp";
import { CompiledItem, OverpassExpression } from "@/model";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

function BuildRegExp(value: OverpassExpression<RegExp>): CompiledItem<RegExp> {
	return new RegExpParamCompiledItem(value);
}

export function parametersRegExpTests() {
	it("Should be fine when regexps are fine", () => ExpectCompileResolves(BuildRegExp, [Symetric.RegExp(/aValue/)]));

	it(`Should error when regexps are nullish`, () => {
		ExpectCompileRejects(BuildRegExp, [Symetric.RegExp(null!)]);
		ExpectCompileRejects(BuildRegExp, [Symetric.RegExp(undefined!)]);
	});

	it("Should error when parameter is not a regexp", () =>
		ExpectCompileRejects(BuildRegExp, [Symetric.RegExp("name" as unknown as RegExp)]));
}
