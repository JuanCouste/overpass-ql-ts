import {
	OverpassCompileUtils,
	OverpassItemEvaluatorBuilderImp,
	OverpassStateImp,
	OverpassTagFilterBuilderImp,
} from "@/imp";
import { OverpassParameterError } from "@/model";
import { describe, expect } from "@jest/globals";
import { symetryUtilsTests } from "./building";
import { targetFormTests } from "./forms";
import { compileItemTests } from "./items";
import { NO_SANITIZER } from "./nosanitizer";
import { parametersCompileTests } from "./sanitization";

/** For information regarding tests see /test/README.md */

describe("Compilation", () => {
	describe("Item", compileItemTests);
	describe("Symetry", symetryUtilsTests);
	describe("Parameters", parametersCompileTests);
	describe("Forms", targetFormTests);
	describe("Query", () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);
		const tags = OverpassTagFilterBuilderImp.Build();
		const evaluator = new OverpassItemEvaluatorBuilderImp();
		const state = new OverpassStateImp(utils, tags, evaluator);

		expect(() => state.proxy.node.byTags({ name: null! as string })).toThrow(OverpassParameterError);
	});
});
