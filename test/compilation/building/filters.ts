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
	it("Should compile equals filter with param prop", () => {
		const [raw, withParams] = CompileFiterSymetric(
			(prop) => new OverpassEqualsTagFilter(prop, "theValue", false),
			[Symetric.String("name")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\[\s*"name"\s*=\s*"theValue"\s*\]/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile equals filter with value prop", () => {
		const [raw, withParams] = CompileFiterSymetric(
			(value) => new OverpassEqualsTagFilter("theName", value, false),
			[Symetric.String("value")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\[\s*"theName"\s*=\s*"value"\s*\]/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile equals filter with all props", () => {
		const [raw, withParams] = CompileFiterSymetric(
			(name, value) => new OverpassEqualsTagFilter(name, value, false),
			[Symetric.String("someName"), Symetric.String("someValue")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\[\s*"someName"\s*=\s*"someValue"\s*\]/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile exists filter", () => {
		const [raw, withParams] = CompileFiterSymetric(
			(prop) => new OverpassExistsTagFilter(prop, false),
			[Symetric.String("name")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\[\s*"name"\s*\]/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile exists filter", () => {
		const [raw, withParams] = CompileFiterSymetric(
			(prop) => new OverpassExistsTagFilter(prop, false),
			[Symetric.String("name")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\[\s*"name"\s*\]/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile regexp filter", () => {
		const [raw, withParams] = CompileFiterSymetric(
			(prop) => new OverpassRegExpTagFilter(prop, /value/, false),
			[Symetric.String("name")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\[\s*"name"\s*~\s*"value"\s*\]/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile regexp filter with regexp prop", () => {
		const [raw, withParams] = CompileFiterSymetric(
			(prop) => new OverpassRegExpTagFilter(prop, /value/, false),
			[Symetric.RegExp(/name/)],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\[\s*~\s*"name"\s*~\s*"value"\s*\]/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile regexp filter with value as param", () => {
		const [raw, withParams] = CompileFiterSymetric(
			(value) => new OverpassRegExpTagFilter("name", value, false),
			[Symetric.RegExp(/value/)],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\[\s*"name"\s*~\s*"value"\s*\]/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile regexp filter with regexp prop and value as param", () => {
		const [raw, withParams] = CompileFiterSymetric(
			(value) => new OverpassRegExpTagFilter(/name/, value, false),
			[Symetric.RegExp(/value/)],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\[\s*~\s*"name"\s*~\s*"value"\s*\]/);

		expect(withParams()).toEqual(rawResult);
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
