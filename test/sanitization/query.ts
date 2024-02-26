import { OverpassExpression, OverpassState, OverpassStatement, ParamType } from "../../src";
import { ItSymetrically, StaticAdapter } from "../utils";
import { ExpectParamteterError, ExpectResolves } from "./adapter";

function FilterObjectEquals(state: OverpassState, name: OverpassExpression<string>): OverpassStatement {
	return state.node.query({ name: name });
}

function FilterArrayEquals(state: OverpassState, name: OverpassExpression<string>): OverpassStatement {
	return state.node.query([["name", name]]);
}

export function sanitizationQueryTests() {
	ItSymetrically(
		"Should be fine when equals filter is fine",
		StaticAdapter,
		FilterObjectEquals,
		[{ exp: "aName", type: ParamType.String }],
		ExpectResolves,
	);

	ItSymetrically(
		"Should error when equals filter is null",
		StaticAdapter,
		FilterObjectEquals,
		[{ exp: null! as string, type: ParamType.String }],
		ExpectParamteterError,
	);

	ItSymetrically(
		"Should error when equals filter is undefined",
		StaticAdapter,
		FilterObjectEquals,
		[{ exp: undefined! as string, type: ParamType.String }],
		ExpectParamteterError,
	);

	ItSymetrically(
		"Should error when equals filter is null in tuple array",
		StaticAdapter,
		FilterArrayEquals,
		[{ exp: null! as string, type: ParamType.String }],
		ExpectParamteterError,
	);
}
