import { OverpassCompileUtils, OverpassFilterBuilderImp, OverpassStateImp } from "@/imp";
import { OverpassParameterError } from "@/model";
import { describe, expect } from "@jest/globals";
import { symetryUtilsTests } from "./building";
import { compileItemTests } from "./items";
import { sanitizationCompileTests } from "./sanitization";

describe("Compilation", () => {
	describe("Item", compileItemTests);
	describe("Symetry", symetryUtilsTests);
	describe("Sanitization", sanitizationCompileTests);

	describe("Query", () => {
		const utils = new OverpassCompileUtils();
		const filter = OverpassFilterBuilderImp.Build();
		const state = new OverpassStateImp(utils, filter);

		expect(() => state.proxy.node.query({ name: null! as string })).toThrow(OverpassParameterError);
	});
});
