import { OverpassExpression, OverpassState, OverpassStatement, ParamType } from "../../src";
import { ItSymetrically, StaticAdapter } from "../utils";
import { ExpectParamteterError, ExpectResolves } from "./adapter";

function getNodeById(state: OverpassState, id: OverpassExpression<number>): OverpassStatement {
	return state.node.byId(id);
}

export function sanitizationNumberTests() {
	ItSymetrically(
		"Should be fine when number is fine",
		StaticAdapter,
		getNodeById,
		[{ exp: 1, type: ParamType.Number }],
		ExpectResolves,
	);

	Array<number>(NaN, Infinity, null!, undefined!).forEach((number) => {
		ItSymetrically(
			`Should error when number is ${number}`,
			StaticAdapter,
			getNodeById,
			[{ exp: number, type: ParamType.Number }],
			ExpectParamteterError,
		);
	});

	ItSymetrically(
		"Should error when parameter is not of number type",
		StaticAdapter,
		getNodeById,
		[{ exp: "1" as unknown as number, type: ParamType.Number }],
		ExpectParamteterError,
	);
}
