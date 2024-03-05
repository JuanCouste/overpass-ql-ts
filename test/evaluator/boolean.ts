import { JBO_STATUE_ID } from "?/utils";
import { it } from "@jest/globals";
import { ExpectJBOEvaluatorFalse, ExpectJBOEvaluatorTrue } from "./utils";

export function booleanEvaluatorTests() {
	it("Should handle evaluator not", async () => await ExpectJBOEvaluatorFalse((e) => e.id().eq(JBO_STATUE_ID).not()));

	it("Should handle evaluator double negation", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.id().neq(JBO_STATUE_ID).not()));

	it("Should handle evaluator or true", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.id().neq(JBO_STATUE_ID).or(e.true)));

	it("Should handle evaluator or false", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.id().neq(JBO_STATUE_ID).or(e.true)));

	it("Should handle evaluator or false true", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.id().neq(JBO_STATUE_ID).or(e.false, e.true)));

	it("Should handle evaluator and false", async () =>
		await ExpectJBOEvaluatorFalse((e) => e.id().eq(JBO_STATUE_ID).and(e.false)));

	it("Should handle evaluator and true false", async () =>
		await ExpectJBOEvaluatorFalse((e) => e.id().eq(JBO_STATUE_ID).and(e.true, e.false)));

	it("Should handle evaluator false and true", async () =>
		await ExpectJBOEvaluatorFalse((e) => e.id().neq(JBO_STATUE_ID).and(e.true)));

	it("Should handle evaluator true and true", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.id().eq(JBO_STATUE_ID).and(e.true)));

	it("Should handle conditional false result", async () =>
		await ExpectJBOEvaluatorFalse((e) => e.true.conditional(e.false, e.true)));

	it("Should handle conditional true result", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.true.conditional(e.true, e.false)));

	it("Should handle conditional false condition", async () =>
		await ExpectJBOEvaluatorFalse((e) => e.false.conditional(e.true, e.false)));

	it("Should handle then else false result", async () =>
		await ExpectJBOEvaluatorFalse((e) => e.true.then(e.false).else(e.true)));

	it("Should handle then else true result", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.true.then(e.true).else(e.false)));

	it("Should handle then else false condition", async () =>
		await ExpectJBOEvaluatorFalse((e) => e.false.then(e.true).else(e.false)));
}
