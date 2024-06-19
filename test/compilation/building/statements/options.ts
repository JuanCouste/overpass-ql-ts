import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { CompileSymetric } from "?/compilation/symetry";
import { Symetric, SymetricArgsExpression, SymetricArgumentsObject } from "?/utils";
import { OverpassCompileUtils, OverpassOutStatement } from "@/imp";
import {
	AnyParamValue,
	OverpassOutputGeoInfo,
	OverpassOutputOptions,
	OverpassOutputVerbosity,
	OverpassSortOrder,
	ParamType,
} from "@/index";
import { expect, it } from "@jest/globals";

export function compileOutStatementTests() {
	it("Should compile empty options", () => {
		const [raw, withParams] = CompileOutStmSymetric(() => ({}), []);

		const rawResult = raw();

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile options with limit", () => {
		const [raw, withParams] = CompileOutStmSymetric((limit) => ({ limit }), [Symetric.Number(12345)]);

		const rawResult = raw();

		expect(rawResult).toMatch(/\b12345\b/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile options with target", () => {
		const [raw, withParams] = CompileOutStmSymetric((targetSet) => ({ targetSet }), [Symetric.String("someSet")]);

		const rawResult = raw();

		expect(rawResult).toMatch(/\.\bsomeSet\b/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile options with bbox", () => {
		const [raw, withParams] = CompileOutStmSymetric(
			(bbox) => ({ boundingBox: bbox }),
			[Symetric.BBox([1, 2, 3, 4])],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*1\s*,\s*2\s*,\s*3\s*,\s*4\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile options with verbosity", () => {
		const [raw, withParams] = CompileOutStmSymetric(
			(verbosity) => ({ verbosity }),
			[Symetric.Enum(ParamType.Verbosity, OverpassOutputVerbosity.Metadata)],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\bmeta\b/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile options with sort order", () => {
		const [raw, withParams] = CompileOutStmSymetric(
			(sortOrder) => ({ sortOrder }),
			[Symetric.Enum(ParamType.SortOrder, OverpassSortOrder.QuadtileIndex)],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\bqt\b/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile options with geo info", () => {
		const [raw, withParams] = CompileOutStmSymetric(
			(geoInfo) => ({ geoInfo }),
			[Symetric.Enum(ParamType.GeoInfo, OverpassOutputGeoInfo.Geometry)],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\bgeom\b/);

		expect(withParams()).toEqual(rawResult);
	});
}

function CompileOutStmSymetric<Args extends AnyParamValue[]>(
	buildOptions: (...args: SymetricArgsExpression<Args>) => OverpassOutputOptions,
	args: SymetricArgumentsObject<Args>,
) {
	const utils = new OverpassCompileUtils(NO_SANITIZER);

	return CompileSymetric<Args>((...args) => new OverpassOutStatement(buildOptions(...args)).compile(utils), args);
}
