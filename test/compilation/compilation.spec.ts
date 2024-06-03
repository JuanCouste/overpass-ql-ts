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
import { NO_SANITIZER } from "./nosanitizer";
import { sanitizationCompileTests } from "./sanitization";
import { sanitizerTests } from "./sanitizer";

describe("Compilation", () => {
	describe("Item", compileItemTests);
	describe("Symetry", symetryUtilsTests);
	describe("Sanitization", sanitizationCompileTests);
	describe("Sanitizer", sanitizerTests);

	describe("Query", () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);
		const tags = OverpassTagFilterBuilderImp.Build();
		const evaluator = new OverpassItemEvaluatorBuilderImp();
		const state = new OverpassStateImp(utils, tags, evaluator);

		expect(() => state.proxy.node.byTags({ name: null! as string })).toThrow(OverpassParameterError);
	});
});
