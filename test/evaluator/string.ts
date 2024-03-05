import { it } from "@jest/globals";
import { ExpectJBOEvaluatorFalse, ExpectJBOEvaluatorTrue } from "./utils";

export function stringEvaluatorTests() {
	it("Should handle evaluator is number", async () =>
		await ExpectJBOEvaluatorFalse((e) => e.string("Hello").isNumber()));

	it("Should handle evaluator parse number", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.number(2).eq(e.string("1").parseNumber().plus(1))));

	it("Should handle evaluator is Date", async () => await ExpectJBOEvaluatorFalse((e) => e.string("Hello").isDate()));

	const date = new Date(Date.UTC(2000, 1, 1));

	it("Should handle evaluator is Date true", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.string(date.toISOString()).isDate()));

	it("Should handle evaluator parse Date", async () => {
		// from overpass git repo string_endomorphisms.cc
		const expectedNUmber = date.getUTCFullYear() + (date.getUTCMonth() + 1) / 16 + date.getUTCDate() / (16 * 32);

		await ExpectJBOEvaluatorTrue((e) =>
			e.date((u) => u.number(expectedNUmber)).eq(e.string(date.toISOString()).parseDate()),
		);
	});

	it("Should handle evaluator as bool", async () => await ExpectJBOEvaluatorTrue((e) => e.string("1").asBool()));

	it("Should handle evaluator as bool false", async () =>
		await ExpectJBOEvaluatorFalse((e) => e.string("0").asBool()));

	it("Should handle evaluator string equals", async () =>
		await ExpectJBOEvaluatorFalse((e) => e.string("0").eq("1")));
}
