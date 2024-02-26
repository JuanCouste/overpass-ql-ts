import { OverpassExpression, OverpassQueryTarget, OverpassState, OverpassStatement, ParamType } from "../../src";
import { ItSymetrically, StaticAdapter } from "../utils";
import { ExpectParamteterError, ExpectResolves } from "./adapter";

function getNodeByTarget(state: OverpassState, target: OverpassExpression<OverpassQueryTarget>): OverpassStatement {
	return state.byId(target, 1);
}

export function sanitizationTargetTests() {
	ItSymetrically(
		"Should be fine when target is fine",
		StaticAdapter,
		getNodeByTarget,
		[{ exp: OverpassQueryTarget.Node, type: ParamType.Target }],
		ExpectResolves,
	);

	ItSymetrically(
		"Should error when parameter is not a target",
		StaticAdapter,
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
			StaticAdapter,
			getNodeByTarget,
			[{ exp: number, type: ParamType.Target }],
			ExpectParamteterError,
		);
	});
}
