import { OverpassExpression, OverpassState, OverpassStatement, ParamType } from "../../src";
import { ItSymetrically, StaticAdapter } from "../utils";
import { ExpectParamteterError, ExpectResolves } from "./adapter";

function staticDate(state: OverpassState, date: OverpassExpression<Date>): OverpassStatement {
	return state.statement((u) => u.date(date));
}

export function sanitizationDateTests() {
	ItSymetrically(
		"Should be fine when dates are fine",
		StaticAdapter,
		staticDate,
		[{ exp: new Date(2000, 2), type: ParamType.Date }],
		ExpectResolves,
	);

	ItSymetrically(
		"Should error when dates are undefined",
		StaticAdapter,
		staticDate,
		[{ exp: undefined! as Date, type: ParamType.Date }],
		ExpectParamteterError,
	);

	ItSymetrically(
		"Should error when dates are null",
		StaticAdapter,
		staticDate,
		[{ exp: null! as Date, type: ParamType.Date }],
		ExpectParamteterError,
	);

	ItSymetrically(
		"Should error when parameter is not a date",
		StaticAdapter,
		staticDate,
		[{ exp: new Date(2000, 2).toISOString() as unknown as Date, type: ParamType.Date }],
		ExpectParamteterError,
	);

	ItSymetrically(
		"Should error when dates are invalid",
		StaticAdapter,
		staticDate,
		[{ exp: new Date(NaN), type: ParamType.Date }],
		ExpectParamteterError,
	);
}
