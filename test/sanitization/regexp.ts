import { expect } from "@jest/globals";
import { OverpassExpression, OverpassState, OverpassStatement, ParamType } from "../../src";
import { ItSymetrically } from "../utils";
import { ExpectParamteterError, SanitizationAdapter } from "./adapter";

function getNodeByName(state: OverpassState, name: OverpassExpression<RegExp>): OverpassStatement {
	return state.node.query((b) => ({ name: b.regExp(name) }));
}

export function sanitizationRegExpTests() {
	ItSymetrically(
		"Should be fine when regexps are fine",
		SanitizationAdapter,
		getNodeByName,
		[{ exp: /aName/, type: ParamType.RegExp }],
		async (result) => await expect(result).resolves.toHaveProperty("elements"),
	);

	ItSymetrically(
		"Should error when regexps are undefined",
		SanitizationAdapter,
		getNodeByName,
		[{ exp: undefined! as RegExp, type: ParamType.RegExp }],
		ExpectParamteterError,
	);

	ItSymetrically(
		"Should error when regexps are null",
		SanitizationAdapter,
		getNodeByName,
		[{ exp: null! as RegExp, type: ParamType.RegExp }],
		ExpectParamteterError,
	);

	ItSymetrically(
		"Should error when parameter is not a regexp",
		SanitizationAdapter,
		getNodeByName,
		[{ exp: "name" as unknown as RegExp, type: ParamType.RegExp }],
		ExpectParamteterError,
	);
}
