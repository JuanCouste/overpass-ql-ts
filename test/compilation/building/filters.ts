import { CompileSymetric } from "?/compilation/symetry";
import { Symetric, SymetricArgsExpression, SymetricArgumentsObject } from "?/utils";
import { OverpassCompileUtils, OverpassEqualsFilter, OverpassExistsFilter, OverpassRegExpFilter } from "@/imp";
import { AnyParamValue, OverpassFilter } from "@/index";
import { expect, it } from "@jest/globals";

export function compileFiltersTests() {
	it("Should compile equals filter with param prop", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(prop) => new OverpassEqualsFilter(prop, "theValue", false),
			[Symetric.String("name")],
		);

		await expect(raw).resolves.toMatch(/\[\s*"name"\s*=\s*"theValue"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile equals filter with value prop", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(value) => new OverpassEqualsFilter("theName", value, false),
			[Symetric.String("value")],
		);

		await expect(raw).resolves.toMatch(/\[\s*"theName"\s*=\s*"value"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile equals filter with all props", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(name, value) => new OverpassEqualsFilter(name, value, false),
			[Symetric.String("someName"), Symetric.String("someValue")],
		);

		await expect(raw).resolves.toMatch(/\[\s*"someName"\s*=\s*"someValue"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile exists filter", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(prop) => new OverpassExistsFilter(prop, false),
			[Symetric.String("name")],
		);

		await expect(raw).resolves.toMatch(/\[\s*"name"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile exists filter", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(prop) => new OverpassExistsFilter(prop, false),
			[Symetric.String("name")],
		);

		await expect(raw).resolves.toMatch(/\[\s*"name"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile regexp filter", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(prop) => new OverpassRegExpFilter(prop, /value/, false),
			[Symetric.String("name")],
		);

		await expect(raw).resolves.toMatch(/\[\s*"name"\s*~\s*"value"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile regexp filter with regexp prop", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(prop) => new OverpassRegExpFilter(prop, /value/, false),
			[Symetric.RegExp(/name/)],
		);

		await expect(raw).resolves.toMatch(/\[\s*~\s*"name"\s*~\s*"value"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile regexp filter with value as param", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(value) => new OverpassRegExpFilter("name", value, false),
			[Symetric.RegExp(/value/)],
		);

		await expect(raw).resolves.toMatch(/\[\s*"name"\s*~\s*"value"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile regexp filter with regexp prop and value as param", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(value) => new OverpassRegExpFilter(/name/, value, false),
			[Symetric.RegExp(/value/)],
		);

		await expect(raw).resolves.toMatch(/\[\s*~\s*"name"\s*~\s*"value"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});
}

function CompileFiterSymetric<Args extends AnyParamValue[]>(
	buildFilter: (...args: SymetricArgsExpression<Args>) => OverpassFilter,
	args: SymetricArgumentsObject<Args>,
) {
	const utils = new OverpassCompileUtils();

	return CompileSymetric<Args>((...args) => buildFilter(...args).compile(utils), args);
}
