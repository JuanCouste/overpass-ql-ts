import { it } from "@jest/globals";
import { ExpectJBOEvaluatorFalse, ExpectJBOEvaluatorTrue } from "./utils";

export function magnitudeEvaluatorTests() {
	const date = new Date(2000, 1, 1);

	it("Should handle evaluator lower than", async () => await ExpectJBOEvaluatorFalse((e) => e.date(date).lt(date)));

	it("Should handle evaluator lower or equals", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.date(date).le(date)));

	it("Should handle evaluator greater than", async () => await ExpectJBOEvaluatorFalse((e) => e.date(date).gt(date)));

	it("Should handle evaluator greater or equals", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.date(date).ge(date)));
}
