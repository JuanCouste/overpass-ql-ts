import { Symetric } from "?/utils";
import { RegExpParamCompiledItem } from "@/imp";
import { CompiledItem, OverpassExpression } from "@/model";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

function BuildRegExp(value: OverpassExpression<RegExp>): CompiledItem<RegExp> {
	return new RegExpParamCompiledItem(value);
}

export function parametersRegExpTests() {
	it("Should be fine when regexps are fine", async () =>
		await ExpectCompileResolves(BuildRegExp, [Symetric.RegExp(/aValue/)]));

	it(`Should error when regexps are nullish`, async () => {
		await ExpectCompileRejects(BuildRegExp, [Symetric.RegExp(null!)]);
		await ExpectCompileRejects(BuildRegExp, [Symetric.RegExp(undefined!)]);
	});

	it("Should error when parameter is not a regexp", async () =>
		await ExpectCompileRejects(BuildRegExp, [Symetric.RegExp("name" as unknown as RegExp)]));
}
