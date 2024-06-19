import { ParentCompiledItem, SetParamCompiledItem } from "@/imp";
import { ParamItem, ParamType } from "@/index";
import { expect, it } from "@jest/globals";

export function itemTransformTests() {
	const paramItem = new ParamItem<string>(0, ParamType.String);

	it("Should be able to transform param multiple times", () => {
		const param = new SetParamCompiledItem(paramItem);

		const chained = param.transform((Hello) => `${Hello} World`).transform((HelloWorld) => `${HelloWorld}!`);

		const result = chained.compile(["Hello"]);

		expect(result).toBe("Hello World!");
	});

	it("Should be able to transform nested items", () => {
		const item = new ParentCompiledItem([new SetParamCompiledItem(paramItem)]);

		const chained = item.transform((Hello) => `${Hello} World!`);

		const result = chained.compile(["Hello"]);

		expect(result).toBe("Hello World!");
	});

	it("Should be able to transform parents with multiple items", () => {
		const item = new ParentCompiledItem([" without", new SetParamCompiledItem(paramItem), "spaces "])
			.transform((raw) => raw.trim())
			.transform((raw) => `(${raw})`);

		const result = item.compile([" "]);

		expect(result).toBe("(without spaces)");
	});

	it("Should be able to compile parents with transformations", () => {
		const item = new ParentCompiledItem([
			new ParentCompiledItem([" without", new SetParamCompiledItem(paramItem), "spaces "]).transform((raw) =>
				raw.trim(),
			),
		]);

		const result = item.compile([" "]);

		expect(result).toBe("without spaces");
	});
}
