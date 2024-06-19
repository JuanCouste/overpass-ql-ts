import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { CompileSymetric } from "?/compilation/symetry";
import { Symetric, SymetricArgsExpression, SymetricArgumentsObject } from "?/utils";
import { OverpassCompileUtils, OverpassSettingsStatement } from "@/imp";
import { AnyParamValue, OverpassSettings } from "@/index";
import { expect, it } from "@jest/globals";

export function compileSettingsStatementsTests() {
	it("Should compile empty settings", () => {
		const [raw, withParams] = CompileSettingsSymetric(() => ({}), []);

		expect(raw).toThrowError(Error);
		expect(withParams).toThrowError(Error);
	});

	it("Should compile settings with timeout", () => {
		const [raw, withParams] = CompileSettingsSymetric((timeout) => ({ timeout }), [Symetric.Number(12345)]);

		const rawResult = raw();

		expect(rawResult).toMatch(/\[\s*timeout\s*:\s*12345\s*\]/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile settings with maxSize", () => {
		const [raw, withParams] = CompileSettingsSymetric((maxSize) => ({ maxSize }), [Symetric.Number(500)]);

		const rawResult = raw();

		expect(rawResult).toMatch(/\[\s*maxsize\s*:\s*500\s*\]/);
		expect(withParams()).toEqual(rawResult);
	});

	const testDate1 = new Date(Date.UTC(2000, 1, 2));
	const testDate2 = new Date(Date.UTC(2003, 4, 5));

	it("Should compile settings with date", () => {
		const [raw, withParams] = CompileSettingsSymetric((date) => ({ date }), [Symetric.Date(testDate1)]);

		const rawResult = raw();

		expect(rawResult).toMatch(/\[\s*date\s*:\s*"2000-02-02T00:00:00\.000Z"\s*\]/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile settings with diff", () => {
		const [raw, withParams] = CompileSettingsSymetric(
			(start, end) => ({ diff: [start, end] }),
			[Symetric.Date(testDate1), Symetric.Date(testDate2)],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\[\s*diff\s*:\s*"2000-02-02T00:00:00\.000Z"\s*,\s*"2003-05-05T00:00:00\.000Z"\s*\]/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile settings with single diff", () => {
		const [raw, withParams] = CompileSettingsSymetric((diff) => ({ diff }), [Symetric.Date(testDate1)]);

		const rawResult = raw();

		expect(rawResult).toMatch(/\[\s*diff\s*:\s*"2000-02-02T00:00:00\.000Z"\s*\]/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile settings with global bbox", () => {
		const [raw, withParams] = CompileSettingsSymetric(
			(bbox) => ({ globalBoundingBox: bbox }),
			[Symetric.BBox([1, 2, 3, 4])],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\[\s*bbox\s*:\s*1\s*,\s*2\s*,\s*3\s*,\s*4\s*\]/);

		expect(withParams()).toEqual(rawResult);
	});
}

function CompileSettingsSymetric<Args extends AnyParamValue[]>(
	buildSettings: (...args: SymetricArgsExpression<Args>) => OverpassSettings,
	args: SymetricArgumentsObject<Args>,
) {
	const utils = new OverpassCompileUtils(NO_SANITIZER);

	return CompileSymetric<Args>(
		(...args) => OverpassSettingsStatement.BuildSettings(buildSettings(...args)).compile(utils),
		args,
	);
}
