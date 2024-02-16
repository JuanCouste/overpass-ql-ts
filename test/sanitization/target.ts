import { expect } from "@jest/globals";
import { OverpassExpression, OverpassQueryTarget, OverpassState, OverpassStatement, ParamType } from "../../src";
import { ItSymetrically } from "../utils";
import { ExpectParamteterError, SanitizationAdapter } from "./adapter";

function getNodeByTarget(state: OverpassState, target: OverpassExpression<OverpassQueryTarget>): OverpassStatement {
	return state.byId(target, 1);
}

export function sanitizationTargetTests() {
	ItSymetrically(
		"Should be fine when target is fine",
		SanitizationAdapter,
		getNodeByTarget,
		[{ exp: OverpassQueryTarget.Node, type: ParamType.Target }],
		async (result) => await expect(result).resolves.toHaveProperty("elements"),
	);

	ItSymetrically(
		"Should error when parameter is not a target",
		SanitizationAdapter,
		getNodeByTarget,
		[{ exp: "1" as unknown as OverpassQueryTarget, type: ParamType.Target }],
		ExpectParamteterError,
	);

	const max = Math.max(
		...(Object.values(OverpassQueryTarget).filter((value) => typeof value == "number") as number[]),
	);

	Array<number>(NaN, Infinity, null!, undefined!, -1, max + 1).forEach((number) => {
		ItSymetrically(
			`Should error when target is ${number}`,
			SanitizationAdapter,
			getNodeByTarget,
			[{ exp: number, type: ParamType.Target }],
			ExpectParamteterError,
		);
	});
}
