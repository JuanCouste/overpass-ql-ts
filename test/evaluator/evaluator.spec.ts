import "?/checkConnection";
//
import { describe } from "@jest/globals";
import { booleanEvaluatorTests } from "./boolean";
import { evaluatorTests } from "./evaluator";

describe("Evaluator", () => {
	describe("Evaluator", evaluatorTests);
	describe("Boolean", booleanEvaluatorTests);
});
