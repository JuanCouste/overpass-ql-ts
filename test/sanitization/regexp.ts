import { OverpassExpression, OverpassState, OverpassStatement, ParamType } from "../../src";
import { ItSymetrically, StaticAdapter } from "../utils";
import { ExpectParamteterError, ExpectResolves } from "./adapter";

function getNodeByName(state: OverpassState, name: OverpassExpression<RegExp>): OverpassStatement {
	return state.node.query((b) => ({ name: b.regExp(name) }));
}

export function sanitizationRegExpTests() {
	ItSymetrically(
		"Should be fine when regexps are fine",
		StaticAdapter,
		getNodeByName,
		[{ exp: /aName/, type: ParamType.RegExp }],
		ExpectResolves,
	);

	ItSymetrically(
		"Should error when regexps are undefined",
		StaticAdapter,
		getNodeByName,
		[{ exp: undefined! as RegExp, type: ParamType.RegExp }],
		ExpectParamteterError,
	);

	ItSymetrically(
		"Should error when regexps are null",
		StaticAdapter,
		getNodeByName,
		[{ exp: null! as RegExp, type: ParamType.RegExp }],
		ExpectParamteterError,
	);

	ItSymetrically(
		"Should error when parameter is not a regexp",
		StaticAdapter,
		getNodeByName,
		[{ exp: "name" as unknown as RegExp, type: ParamType.RegExp }],
		ExpectParamteterError,
	);
}
