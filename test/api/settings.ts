import { expect, it } from "@jest/globals";
import {
	AnyParamValue,
	OverpassApiObject,
	OverpassBoundingBox,
	OverpassErrorType,
	OverpassFormat,
	OverpassOutputOptions,
	OverpassRemarkError,
	OverpassSettingsNoFormat,
	ParamType,
	RequestAdapter,
} from "../../src";
import {
	AnySymetricArguments,
	BuildApi,
	ItSymetricallyWOpts,
	MDEO_BBOX,
	MDEO_ID,
	ONLY_IDS,
	SymetricArgsExpression,
} from "../utils";
import { asyncExpectUruguay, uruguayStatementBuilder } from "./uruguay";

export function apiSettingsTests() {
	ItSymetricallyCheckQuery(
		"Should build timeout queries",
		(_) => ONLY_IDS,
		(timeout) => ({ timeout }),
		[{ exp: 12345, type: ParamType.Number }],
		(query) => expect(query).toMatch(/\[[\s\n]*timeout[\s\n]*:[\s\n]*12345[\s\n]*\]/),
	);

	ItSymetricallyWOpts<[number], OverpassSettingsNoFormat, OverpassOutputOptions>(
		"Should run timeout queries",
		BuildApi,
		(s) => uruguayStatementBuilder(s),
		(_) => ONLY_IDS,
		(timeout) => ({ timeout }),
		[{ exp: 12345, type: ParamType.Number }],
		async (result) => await asyncExpectUruguay(result),
	);

	ItSymetricallyCheckQuery(
		"Should build date queries",
		(_) => ONLY_IDS,
		(date) => ({ date }),
		[{ exp: new Date(Date.UTC(2000, 1, 2)), type: ParamType.Date }],
		(query) => expect(query).toMatch(/\[[\s\n]*date[\s\n]*:[\s\n]*"2000-02-02T00:00:00\.000Z"[\s\n]*\]/),
	);

	ItSymetricallyWOpts<[Date], OverpassSettingsNoFormat, OverpassOutputOptions>(
		"Should run date queries",
		BuildApi,
		(s) => uruguayStatementBuilder(s),
		(_) => ONLY_IDS,
		(date) => ({ date }),
		[{ exp: new Date(Date.UTC(2000, 1, 2)), type: ParamType.Date }],
		async (promise) => {
			await expect(promise).rejects.toThrow(OverpassRemarkError);
			await expect(promise).rejects.toHaveProperty("type", OverpassErrorType.NoAtticData);
		},
	);

	it("Should run diff queries", async () => {
		const api: OverpassApiObject = BuildApi();

		const query = api.buildQuery(uruguayStatementBuilder, ONLY_IDS, {
			format: OverpassFormat.XML,
			diff: [new Date(Date.UTC(2000, 1, 2)), new Date(Date.UTC(2003, 4, 5))],
		});

		expect(query).toMatch(
			/\[[\s\n]*diff[\s\n]*:[\s\n]*"2000-02-02T00:00:00\.000Z"[\s\n]*,[\s\n]*"2003-05-05T00:00:00\.000Z"[\s\n]*\]/,
		);

		const promise = api.execQuery(query);

		await expect(promise).rejects.toThrow(OverpassRemarkError);
		await expect(promise).rejects.toHaveProperty("type", OverpassErrorType.NoAtticData);
	});

	it("Should run queries with no settings", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.exec({}, uruguayStatementBuilder, ONLY_IDS);

		expect(typeof result).toBe("string");

		expect(result).toMatch("<?xml");
	});

	ItSymetricallyCheckQuery(
		"Should build queries with maxSize",
		(_) => ONLY_IDS,
		(maxSize) => ({ maxSize }),
		[{ exp: 500, type: ParamType.Number }],
		(query) => expect(query).toMatch(/\[[\s\n]*maxsize[\s\n]*:[\s\n]*500[\s\n]*\]/),
	);

	ItSymetricallyWOpts<[number], OverpassSettingsNoFormat, OverpassOutputOptions>(
		"Should run queries with maxSize",
		BuildApi,
		(s) => uruguayStatementBuilder(s),
		(_) => ONLY_IDS,
		(maxSize) => ({ maxSize }),
		[{ exp: 500, type: ParamType.Number }],
		async (promise) => await asyncExpectUruguay(promise),
	);

	ItSymetricallyWOpts<[OverpassBoundingBox], OverpassSettingsNoFormat, OverpassOutputOptions>(
		"Should run queries with globalBoundingBox",
		BuildApi,
		(s) =>
			s.node.query((b) => [
				["name", b.equals("Montevideo")],
				["capital", b.equals("yes")],
			]),
		(_) => ONLY_IDS,
		(bbox) => ({ globalBoundingBox: bbox }),
		[{ exp: MDEO_BBOX, type: ParamType.BoundingBox }],
		async (result) => {
			expect(result).resolves.toBeInstanceOf(Object);

			const { elements } = await result;

			expect(elements.length).toBe(1);
			const [element] = elements;

			expect(element.id).toEqual(MDEO_ID);
			expect(element.type).toBe("node");
		},
	);
}

const staticQueryAdapter: RequestAdapter = {
	request(_, { body } = {}) {
		throw decodeURIComponent(body!.substring("data=".length));
	},
};

function ItSymetricallyCheckQuery<Args extends AnyParamValue[]>(
	testName: string,
	optionsBld: ((...args: SymetricArgsExpression<Args>) => OverpassOutputOptions) | undefined,
	settingsBld: ((...args: SymetricArgsExpression<Args>) => OverpassSettingsNoFormat) | undefined,
	symetricArgs: AnySymetricArguments<Args>,
	check: (query: string) => void,
) {
	ItSymetricallyWOpts(
		testName,
		() => BuildApi(() => staticQueryAdapter),
		(s, ..._) => s.node.byId(1),
		optionsBld,
		settingsBld,
		symetricArgs,
		async (result) => {
			try {
				await result;
			} catch (query) {
				check(query as string);
			}
		},
	);
}
