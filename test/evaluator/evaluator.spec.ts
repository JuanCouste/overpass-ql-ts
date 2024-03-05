import "?/checkConnection";
//
import { describe, it } from "@jest/globals";
import { booleanEvaluatorTests } from "./boolean";
import { elementEvaluatorTests } from "./element";
import { evaluatorTests } from "./evaluator";
import { magnitudeEvaluatorTests } from "./magnitude";
import { numberEvaluatorTests } from "./number";
import { stringEvaluatorTests } from "./string";
import { ExpectJBOEvaluatorFalse } from "./utils";

describe("Evaluator", () => {
	describe("Evaluator", evaluatorTests);
	describe("Element", elementEvaluatorTests);
	describe("Boolean", booleanEvaluatorTests);
	describe("Number", numberEvaluatorTests);
	describe("String", stringEvaluatorTests);
	describe("Magnitude", magnitudeEvaluatorTests);

	describe("Date", () => {
		it("Should handle evaluator number conditional", async () =>
			await ExpectJBOEvaluatorFalse((e) =>
				e.true.conditional(e.date(new Date(2000, 1, 1)), e.date(new Date(2000, 1, 2))).eq(new Date(2000, 1, 2)),
			));
	});
});
