import {
	OverpassCompileUtils,
	OverpassItemEvaluatorBuilderImp,
	OverpassStateImp,
	OverpassTagFilterBuilderImp,
} from "@/imp";
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
		const tags = OverpassTagFilterBuilderImp.Build();
		const evaluator = new OverpassItemEvaluatorBuilderImp();
		const state = new OverpassStateImp(utils, tags, evaluator);

		expect(() => state.proxy.node.query({ name: null! as string })).toThrow(OverpassParameterError);
	});
});
