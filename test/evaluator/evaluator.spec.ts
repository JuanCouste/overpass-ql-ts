import "?/checkConnection";
//
import { describe } from "@jest/globals";
import { booleanEvaluatorTests } from "./boolean";
import { evaluatorTests } from "./evaluator";
import { numberEvaluatorTests } from "./number";

describe("Evaluator", () => {
	describe("Evaluator", evaluatorTests);
	describe("Boolean", booleanEvaluatorTests);
	describe("Number", numberEvaluatorTests);
});
