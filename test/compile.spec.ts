import { describe, expect, it } from "@jest/globals";
import { ParamCompiledItem, ParamType, ParentCompiledItem } from "../src";
import { OverpassParamCompiledItem } from "../src/imp/api/compile/param";
import { OverpassParentCompiledItem } from "../src/imp/api/compile/parent";

describe("Compile", () => {
	it("Should chain param manipulations", () => {
		const item = new OverpassParamCompiledItem<string>(
			{ index: 0, type: ParamType.String },
			(Hello) => new OverpassParentCompiledItem([Hello]),
		);

		const chained = item
			.withManipulation((Hello) => `${Hello} World`)
			.withManipulation((HelloWorld) => `${HelloWorld}!`) as ParamCompiledItem<string>;

		const result = chained.compile("Hello");

		expect(result).toBe("Hello World!");
	});

	it("Should chain on last manipulation", () => {
		const item = new OverpassParentCompiledItem([
			new OverpassParamCompiledItem<string>(
				{ index: 0, type: ParamType.String },
				(param) => new OverpassParentCompiledItem([param]),
			),
		]);

		const chained = item.withManipulation((Hello) => `${Hello} World!`) as ParentCompiledItem;

		expect(chained.subParts.length).toBe(1);

		const result = (chained.subParts[0] as ParamCompiledItem<string>).compile("Hello");

		expect(result).toBe("Hello World!");
	});
});
