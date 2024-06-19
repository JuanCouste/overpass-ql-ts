import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { CompileSymetric } from "?/compilation/symetry";
import { Symetric, SymetricArgsExpression, SymetricArgumentsObject } from "?/utils";
import {
	OverpassCompileUtils,
	OverpassEqualsTagFilter,
	OverpassExistsTagFilter,
	OverpassRegExpTagFilter,
	OverpassTagFilterBuilderImp,
} from "@/imp";
import { OverpassTargetMapStateImp } from "@/imp/api/target";
import { AnyParamValue, OverpassParameterError, OverpassTagFilter } from "@/index";
import { expect, it } from "@jest/globals";

export function compileFiltersTests() {
	it("Should compile equals filter with param prop", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(prop) => new OverpassEqualsTagFilter(prop, "theValue", false),
			[Symetric.String("name")],
		);

		await expect(raw).resolves.toMatch(/\[\s*"name"\s*=\s*"theValue"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile equals filter with value prop", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(value) => new OverpassEqualsTagFilter("theName", value, false),
			[Symetric.String("value")],
		);

		await expect(raw).resolves.toMatch(/\[\s*"theName"\s*=\s*"value"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile equals filter with all props", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(name, value) => new OverpassEqualsTagFilter(name, value, false),
			[Symetric.String("someName"), Symetric.String("someValue")],
		);

		await expect(raw).resolves.toMatch(/\[\s*"someName"\s*=\s*"someValue"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile exists filter", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(prop) => new OverpassExistsTagFilter(prop, false),
			[Symetric.String("name")],
		);

		await expect(raw).resolves.toMatch(/\[\s*"name"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile exists filter", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(prop) => new OverpassExistsTagFilter(prop, false),
			[Symetric.String("name")],
		);

		await expect(raw).resolves.toMatch(/\[\s*"name"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile regexp filter", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(prop) => new OverpassRegExpTagFilter(prop, /value/, false),
			[Symetric.String("name")],
		);

		await expect(raw).resolves.toMatch(/\[\s*"name"\s*~\s*"value"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile regexp filter with regexp prop", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(prop) => new OverpassRegExpTagFilter(prop, /value/, false),
			[Symetric.RegExp(/name/)],
		);

		await expect(raw).resolves.toMatch(/\[\s*~\s*"name"\s*~\s*"value"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile regexp filter with value as param", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(value) => new OverpassRegExpTagFilter("name", value, false),
			[Symetric.RegExp(/value/)],
		);

		await expect(raw).resolves.toMatch(/\[\s*"name"\s*~\s*"value"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile regexp filter with regexp prop and value as param", async () => {
		const [raw, withParams] = CompileFiterSymetric(
			(value) => new OverpassRegExpTagFilter(/name/, value, false),
			[Symetric.RegExp(/value/)],
		);

		await expect(raw).resolves.toMatch(/\[\s*~\s*"name"\s*~\s*"value"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should error when byTags filter is null", () => {
		const tags = OverpassTagFilterBuilderImp.Build();
		const target = new OverpassTargetMapStateImp(null!, null!, null!, tags, null!);

		expect(() => target.byTags({ name: null! as string })).toThrow(OverpassParameterError);
	});
}

function CompileFiterSymetric<Args extends AnyParamValue[]>(
	buildFilter: (...args: SymetricArgsExpression<Args>) => OverpassTagFilter,
	args: SymetricArgumentsObject<Args>,
) {
	const utils = new OverpassCompileUtils(NO_SANITIZER);

	return CompileSymetric<Args>((...args) => buildFilter(...args).compile(utils), args);
}
