import { CompileSymetric } from "?/compilation/symetry";
import { Symetric, SymetricArgsExpression, SymetricArgumentsObject } from "?/utils";
import { OverpassCompileUtils, OverpassQueryBuilderImp } from "@/imp";
import { AnyParamValue, OverpassSettings } from "@/index";
import { expect, it } from "@jest/globals";

export function compileSettingsTests() {
	it("Should compile empty settings", async () => {
		const [raw, withParams] = CompileSettingsSymetric(() => ({}), []);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile settings with timeout", async () => {
		const [raw, withParams] = CompileSettingsSymetric((timeout) => ({ timeout }), [Symetric.Number(12345)]);

		await expect(raw).resolves.toMatch(/\[\s*timeout\s*:\s*12345\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile settings with maxSize", async () => {
		const [raw, withParams] = CompileSettingsSymetric((maxSize) => ({ maxSize }), [Symetric.Number(500)]);

		await expect(raw).resolves.toMatch(/\[\s*maxsize\s*:\s*500\s*\]/);
		await expect(withParams).resolves.toEqual(await raw);
	});

	const testDate1 = new Date(Date.UTC(2000, 1, 2));
	const testDate2 = new Date(Date.UTC(2003, 4, 5));

	it("Should compile settings with date", async () => {
		const [raw, withParams] = CompileSettingsSymetric((date) => ({ date }), [Symetric.Date(testDate1)]);

		await expect(raw).resolves.toMatch(/\[\s*date\s*:\s*"2000-02-02T00:00:00\.000Z"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile settings with diff", async () => {
		const [raw, withParams] = CompileSettingsSymetric(
			(start, end) => ({ diff: [start, end] }),
			[Symetric.Date(testDate1), Symetric.Date(testDate2)],
		);

		await expect(raw).resolves.toMatch(
			/\[\s*diff\s*:\s*"2000-02-02T00:00:00\.000Z"\s*,\s*"2003-05-05T00:00:00\.000Z"\s*\]/,
		);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile settings with single diff", async () => {
		const [raw, withParams] = CompileSettingsSymetric((diff) => ({ diff }), [Symetric.Date(testDate1)]);

		await expect(raw).resolves.toMatch(/\[\s*diff\s*:\s*"2000-02-02T00:00:00\.000Z"\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile settings with global bbox", async () => {
		const [raw, withParams] = CompileSettingsSymetric(
			(bbox) => ({ globalBoundingBox: bbox }),
			[Symetric.BBox([1, 2, 3, 4])],
		);

		await expect(raw).resolves.toMatch(/\[\s*bbox\s*:\s*1\s*,\s*2\s*,\s*3\s*,\s*4\s*\]/);

		await expect(withParams).resolves.toEqual(await raw);
	});
}

function CompileSettingsSymetric<Args extends AnyParamValue[]>(
	buildSettings: (...args: SymetricArgsExpression<Args>) => OverpassSettings,
	args: SymetricArgumentsObject<Args>,
) {
	const utils = new OverpassCompileUtils();
	const builder = new OverpassQueryBuilderImp(utils);

	return CompileSymetric<Args>((...args) => builder.buildSettings(buildSettings(...args)), args);
}
