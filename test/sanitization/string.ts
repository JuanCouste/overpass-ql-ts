import { describe, expect } from "@jest/globals";
import { OverpassExpression, OverpassQueryTarget, OverpassState, OverpassStatement, ParamType } from "../../src";
import { ItSymetrically } from "../utils";
import { ExpectParamteterError, SanitizationAdapter } from "./adapter";

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
	});

	describe("Unquoted", () => {
		ItSymetrically(
			"Should be fine when strings are fine",
			SanitizationAdapter,
			getNodeFromSet,
			[{ exp: "aSet", type: ParamType.String }],
			async (result) => await expect(result).resolves.toHaveProperty("elements"),
		);

		ItSymetrically(
			"Should error when strings are undefined",
			SanitizationAdapter,
			getNodeFromSet,
			[{ exp: undefined! as string, type: ParamType.String }],
			ExpectParamteterError,
		);

		ItSymetrically(
			"Should error when strings are null",
			SanitizationAdapter,
			getNodeFromSet,
			[{ exp: null! as string, type: ParamType.String }],
			ExpectParamteterError,
		);

		ItSymetrically(
			"Should error when parameter is not a string",
			SanitizationAdapter,
			getNodeFromSet,
			[{ exp: 1 as unknown as string, type: ParamType.String }],
			ExpectParamteterError,
		);
	});
}
