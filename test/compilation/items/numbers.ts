import { Symetric } from "?/utils";
import { NumberParamCompiledItem } from "@/imp";
import { CompiledItem, OverpassExpression } from "@/model";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

function BuildNumber(value: OverpassExpression<number>): CompiledItem<number> {
	return new NumberParamCompiledItem(value);
}

export function parametersNumberTests() {
	it("Should be fine when numbers are fine", () => ExpectCompileResolves(BuildNumber, [Symetric.Number(1)]));

	it(`Should error when numbers are nullish`, () => {
		ExpectCompileRejects(BuildNumber, [Symetric.Number(null!)]);
		ExpectCompileRejects(BuildNumber, [Symetric.Number(undefined!)]);
	});

	it("Should error when parameter is not a number", () =>
		ExpectCompileRejects(BuildNumber, [Symetric.Number("1" as unknown as number)]));
}
