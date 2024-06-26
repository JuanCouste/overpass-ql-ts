import { Symetric } from "?/utils";
import { SetParamCompiledItem } from "@/imp";
import { CompiledItem, OverpassExpression } from "@/model";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

function BuildSet(value: OverpassExpression<string>): CompiledItem<string> {
	return new SetParamCompiledItem(value);
}

export function parametersSetTests() {
	it("Should be fine when sets are fine", () => ExpectCompileResolves(BuildSet, [Symetric.String("aSet")]));

	it(`Should error when sets are nullish`, () => {
		ExpectCompileRejects(BuildSet, [Symetric.String(null!)]);
		ExpectCompileRejects(BuildSet, [Symetric.String(undefined!)]);
	});

	it("Should error when parameter is not a set", () =>
		ExpectCompileRejects(BuildSet, [Symetric.String(/name/ as unknown as string)]));
}
