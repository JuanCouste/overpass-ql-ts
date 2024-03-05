import { JBO_STATUE_ID } from "?/utils";
import { it } from "@jest/globals";
import { ExpectJBOEvaluatorFalse, ExpectJBOEvaluatorTrue } from "./utils";

export function evaluatorTests() {
	it("Should handle evaluator id equals", async () => await ExpectJBOEvaluatorTrue((e) => e.id().eq(JBO_STATUE_ID)));

	it("Should handle evaluator id not equals", async () =>
		await ExpectJBOEvaluatorFalse((e) => e.id().neq(JBO_STATUE_ID)));
}
