import { describe } from "@jest/globals";
import { OverpassExpression, OverpassQueryTarget, OverpassState, OverpassStatement, ParamType } from "../../src";
import { ItSymetrically, StaticAdapter } from "../utils";
import { ExpectParamteterError, ExpectResolves } from "./adapter";

function getNodeByName(state: OverpassState, name: OverpassExpression<string>): OverpassStatement {
	return state.node.query((b) => ({ name: b.equals(name) }));
}

function getNodeFromSet(state: OverpassState, set: OverpassExpression<string>): OverpassStatement {
	return state.intersect(OverpassQueryTarget.Node, set);
}

export function sanitizationStringTests() {
	describe("Quoted", () => {
		ItSymetrically(
			"Should be fine when strings are fine",
			StaticAdapter,
			getNodeByName,
			[{ exp: "aName", type: ParamType.String }],
			ExpectResolves,
		);

		ItSymetrically(
			"Should error when strings are undefined",
			StaticAdapter,
			getNodeByName,
			[{ exp: undefined! as string, type: ParamType.String }],
			ExpectParamteterError,
		);

		ItSymetrically(
			"Should error when strings are null",
			StaticAdapter,
			getNodeByName,
			[{ exp: null! as string, type: ParamType.String }],
			ExpectParamteterError,
		);

		ItSymetrically(
			"Should error when parameter is not a string",
			StaticAdapter,
			getNodeByName,
			[{ exp: 1 as unknown as string, type: ParamType.String }],
			ExpectParamteterError,
		);
	});

	describe("Unquoted", () => {
		ItSymetrically(
			"Should be fine when strings are fine",
			StaticAdapter,
			getNodeFromSet,
			[{ exp: "aSet", type: ParamType.String }],
			ExpectResolves,
		);

		ItSymetrically(
			"Should error when strings are undefined",
			StaticAdapter,
			getNodeFromSet,
			[{ exp: undefined! as string, type: ParamType.String }],
			ExpectParamteterError,
		);

		ItSymetrically(
			"Should error when strings are null",
			StaticAdapter,
			getNodeFromSet,
			[{ exp: null! as string, type: ParamType.String }],
			ExpectParamteterError,
		);

		ItSymetrically(
			"Should error when parameter is not a string",
			StaticAdapter,
			getNodeFromSet,
			[{ exp: 1 as unknown as string, type: ParamType.String }],
			ExpectParamteterError,
		);
	});
}
