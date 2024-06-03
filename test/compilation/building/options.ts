import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { CompileSymetric } from "?/compilation/symetry";
import { Symetric, SymetricArgsExpression, SymetricArgumentsObject } from "?/utils";
import { OverpassCompileUtils, OverpassQueryBuilderImp } from "@/imp";
import {
	AnyParamValue,
	OverpassOutputGeoInfo,
	OverpassOutputOptions,
	OverpassOutputVerbosity,
	OverpassSortOrder,
	ParamType,
} from "@/index";
import { expect, it } from "@jest/globals";

export function compileOptionsTests() {
	it("Should compile empty options", async () => {
		const [raw, withParams] = CompileOptionsSymetric(() => ({}), []);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile options with limit", async () => {
		const [raw, withParams] = CompileOptionsSymetric((limit) => ({ limit }), [Symetric.Number(12345)]);

		await expect(raw).resolves.toMatch(/\b12345\b/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile options with target", async () => {
		const [raw, withParams] = CompileOptionsSymetric((targetSet) => ({ targetSet }), [Symetric.String("someSet")]);

		await expect(raw).resolves.toMatch(/\.\bsomeSet\b/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile options with bbox", async () => {
		const [raw, withParams] = CompileOptionsSymetric(
			(bbox) => ({ boundingBox: bbox }),
			[Symetric.BBox([1, 2, 3, 4])],
		);

		await expect(raw).resolves.toMatch(/\(\s*1\s*,\s*2\s*,\s*3\s*,\s*4\s*\)/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile options with verbosity", async () => {
		const [raw, withParams] = CompileOptionsSymetric(
			(verbosity) => ({ verbosity }),
			[Symetric.Enum(ParamType.Verbosity, OverpassOutputVerbosity.Metadata)],
		);

		await expect(raw).resolves.toMatch(/\bmeta\b/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile options with sort order", async () => {
		const [raw, withParams] = CompileOptionsSymetric(
			(sortOrder) => ({ sortOrder }),
			[Symetric.Enum(ParamType.SortOrder, OverpassSortOrder.QuadtileIndex)],
		);

		await expect(raw).resolves.toMatch(/\bqt\b/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile options with geo info", async () => {
		const [raw, withParams] = CompileOptionsSymetric(
			(geoInfo) => ({ geoInfo }),
			[Symetric.Enum(ParamType.GeoInfo, OverpassOutputGeoInfo.Geometry)],
		);

		await expect(raw).resolves.toMatch(/\bgeom\b/);

		await expect(withParams).resolves.toEqual(await raw);
	});
}

function CompileOptionsSymetric<Args extends AnyParamValue[]>(
	buildOptions: (...args: SymetricArgsExpression<Args>) => OverpassOutputOptions,
	args: SymetricArgumentsObject<Args>,
) {
	const utils = new OverpassCompileUtils(NO_SANITIZER);
	const builder = new OverpassQueryBuilderImp(utils);

	return CompileSymetric<Args>((...args) => builder.buildOptions(buildOptions(...args)), args);
}
