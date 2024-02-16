import { expect } from "@jest/globals";
import { OverpassExpression, OverpassState, OverpassStatement, ParamType } from "../../src";
import { ItSymetrically } from "../utils";
import { ExpectParamteterError, SanitizationAdapter } from "./adapter";

function getNodeById(state: OverpassState, id: OverpassExpression<number>): OverpassStatement {
	return state.node.byId(id);
}

export function sanitizationNumberTests() {
	ItSymetrically(
		"Should be fine when number is fine",
		SanitizationAdapter,
		getNodeById,
		[{ exp: 1, type: ParamType.Number }],
		async (result) => await expect(result).resolves.toHaveProperty("elements"),
	);

	Array<number>(NaN, Infinity, null!, undefined!).forEach((number) => {
		ItSymetrically(
			`Should error when number is ${number}`,
			SanitizationAdapter,
			getNodeById,
			[{ exp: number, type: ParamType.Number }],
			ExpectParamteterError,
		);
	});

	ItSymetrically(
		"Should error when parameter is not of number type",
		SanitizationAdapter,
		getNodeById,
		[{ exp: "1" as unknown as number, type: ParamType.Number }],
		ExpectParamteterError,
	);
}
