import { OverpassParamCompiledItem, OverpassParentCompiledItem } from "@/imp";
import { ParamType } from "@/index";
import { expect, it } from "@jest/globals";

export function compileItemTests() {
	it("Should chain param manipulations", () => {
		const param = new OverpassParamCompiledItem<string>(
			{ index: 0, type: ParamType.String },
			(Hello) => new OverpassParentCompiledItem([Hello]),
		);

		const chained = param
			.withManipulation((Hello) => `${Hello} World`)
			.withManipulation((HelloWorld) => `${HelloWorld}!`);

		const result = chained.compile(["Hello"]);

		expect(result).toBe("Hello World!");
	});

	it("Should chain on last manipulation", () => {
		const item = new OverpassParentCompiledItem([
			new OverpassParamCompiledItem<string>(
				{ index: 0, type: ParamType.String },
				(param) => new OverpassParentCompiledItem([param]),
			),
		]);

		const chained = item.withManipulation((Hello) => `${Hello} World!`);

		const result = chained.compile(["Hello"]);

		expect(result).toBe("Hello World!");
	});

	it("Should manipulate on many parts", () => {
		const thisIsInQuotes = new OverpassParentCompiledItem([
			"This",
			new OverpassParamCompiledItem<string>(
				{ index: 0, type: ParamType.String },
				(isIn) => new OverpassParentCompiledItem([" ", isIn, " "]),
			),
			"quotes",
		]).withManipulation((raw) => `"${raw}"`);

		const result = thisIsInQuotes.compile(["is in"]);

		expect(result).toBe('"This is in quotes"');
	});

	it("Should chain parent manipulations", () => {
		const item = new OverpassParentCompiledItem([
			" without",
			new OverpassParamCompiledItem<string>(
				{ index: 0, type: ParamType.String },
				(space) => new OverpassParentCompiledItem([space]),
			),
			"spaces ",
		])
			.withManipulation((raw) => raw.trim())
			.withManipulation((raw) => `(${raw})`);

		const result = item.compile([" "]);

		expect(result).toBe("(without spaces)");
	});

	it("Should wrap parent manipulation", () => {
		const item = new OverpassParentCompiledItem([
			new OverpassParentCompiledItem([
				" without",
				new OverpassParamCompiledItem<string>(
					{ index: 0, type: ParamType.String },
					(space) => new OverpassParentCompiledItem([space]),
				),
				"spaces ",
			]).withManipulation((raw) => raw.trim()),
		]);

		const result = item.compile([" "]);

		expect(result).toBe("without spaces");
	});

	it("Should wrap param manipulation", () => {
		const item = new OverpassParentCompiledItem([
			new OverpassParentCompiledItem([
				" without",
				new OverpassParamCompiledItem<string>(
					{ index: 0, type: ParamType.String },
					(space) => new OverpassParentCompiledItem([space]),
				),
				"spaces ",
			]).withManipulation((raw) => raw.trim()),
		]);

		const result = item.compile([" "]);

		expect(result).toBe("without spaces");
	});

	it("Should flatten wraped param manipulation", () => {
		const item = new OverpassParentCompiledItem([
			new OverpassParentCompiledItem([
				new OverpassParamCompiledItem<string>(
					{ index: 0, type: ParamType.String },
					(trimable) => new OverpassParentCompiledItem([trimable]),
				),
			]).withManipulation((raw) => raw.trim()),
		]);

		const result = item.compile([" trimable "]);

		expect(result).toBe("trimable");
	});
}
