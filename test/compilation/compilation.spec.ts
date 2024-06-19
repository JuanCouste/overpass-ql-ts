import { describe } from "@jest/globals";
import { symetryUtilsTests } from "./building";
import { targetFormTests } from "./forms";
import { compileItemTests } from "./items";

/** For information regarding tests see /test/README.md */

describe("Compilation", () => {
	describe("Item", compileItemTests);
	describe("Symetry", symetryUtilsTests);
	describe("Forms", targetFormTests);
});
