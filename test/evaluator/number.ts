import { JBO_STATUE_ID } from "?/utils";
import { it } from "@jest/globals";
import { ExpectJBOEvaluatorFalse, ExpectJBOEvaluatorTrue } from "./utils";

export function numberEvaluatorTests() {
	it("Should handle evaluator abs", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.id().eq(e.number(-JBO_STATUE_ID).abs())));

	it("Should handle evaluator plus", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.id().eq(e.number(JBO_STATUE_ID - 1).plus(1))));

	it("Should handle evaluator minus", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.id().eq(e.number(JBO_STATUE_ID + 1).minus(1))));

	it("Should handle evaluator times", async () =>
		await ExpectJBOEvaluatorTrue((e) =>
			e.id().eq(
				e
					.number(Math.floor(JBO_STATUE_ID / 2))
					.times(2)
					.plus(1),
			),
		));

	it("Should handle evaluator divide", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.id().eq(e.number(JBO_STATUE_ID * 2).dividedBy(2))));

	it("Should handle evaluator number conditional", async () =>
		await ExpectJBOEvaluatorFalse((e) => e.true.conditional(e.number(0), e.number(1)).eq(1)));
}
