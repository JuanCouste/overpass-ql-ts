import { expect } from "@jest/globals";
import { OverpassExpression, OverpassState, OverpassStatement, ParamType } from "../../src";
import { ItSymetrically } from "../utils";
import { ExpectParamteterError, SanitizationAdapter } from "./adapter";

function getNodeByName(state: OverpassState, name: OverpassExpression<string>): OverpassStatement {
	return state.node.query((b) => ({ name: b.equals(name) }));
}

export function sanitizationStringTests() {
	ItSymetrically(
		"Should be fine when strings are fine",
		SanitizationAdapter,
		getNodeByName,
		[{ exp: "aName", type: ParamType.String }],
		async (result) => await expect(result).resolves.toHaveProperty("elements"),
	);

	ItSymetrically(
		"Should error when strings are undefined",
		SanitizationAdapter,
		getNodeByName,
		[{ exp: undefined! as string, type: ParamType.String }],
		ExpectParamteterError,
	);

	ItSymetrically(
		"Should error when strings are null",
		SanitizationAdapter,
		getNodeByName,
		[{ exp: null! as string, type: ParamType.String }],
		ExpectParamteterError,
	);

	ItSymetrically(
		"Should error when parameter is not a string",
		SanitizationAdapter,
		getNodeByName,
		[{ exp: 1 as unknown as string, type: ParamType.String }],
		ExpectParamteterError,
	);
}
