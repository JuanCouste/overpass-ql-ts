import { expect } from "@jest/globals";
import { OverpassExpression, OverpassState, OverpassStatement, ParamType } from "../../src";
import { ItSymetrically } from "../utils";
import { ExpectParamteterError, SanitizationAdapter } from "./adapter";

function FilterObjectEquals(state: OverpassState, name: OverpassExpression<string>): OverpassStatement {
	return state.node.query({ name: name });
}

function FilterArrayEquals(state: OverpassState, name: OverpassExpression<string>): OverpassStatement {
	return state.node.query([["name", name]]);
}

export function sanitizationQueryTests() {
	ItSymetrically(
		"Should be fine when equals filter is fine",
		SanitizationAdapter,
		FilterObjectEquals,
		[{ exp: "aName", type: ParamType.String }],
		async (result) => await expect(result).resolves.toHaveProperty("elements"),
	);

	ItSymetrically(
		"Should error when equals filter is null",
		SanitizationAdapter,
		FilterObjectEquals,
		[{ exp: null! as string, type: ParamType.String }],
		ExpectParamteterError,
	);

	ItSymetrically(
		"Should error when equals filter is undefined",
		SanitizationAdapter,
		FilterObjectEquals,
		[{ exp: undefined! as string, type: ParamType.String }],
		ExpectParamteterError,
	);

	ItSymetrically(
		"Should error when equals filter is null in tuple array",
		SanitizationAdapter,
		FilterArrayEquals,
		[{ exp: null! as string, type: ParamType.String }],
		ExpectParamteterError,
	);
}
