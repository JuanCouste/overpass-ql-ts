import { APP_OSM_XML, BuildApi, JSON_FORMAT, ONLY_IDS, TEXT_CSV } from "?/utils";
import {
	OverpassApiObject,
	OverpassApiObjectImp,
	OverpassFormat,
	OverpassQueryValidator,
	ParamItem,
	ParamType,
	RequestAdapter,
} from "@/index";
import { expect, it } from "@jest/globals";
import { expectUruguay, uruguayStatementBuilder } from "./uruguay";

function getUnknownFormat(contentType: string | undefined): Promise<OverpassFormat | undefined> {
	return new Promise((resolve) => {
		const adapter: RequestAdapter = {
			request: async () => ({ status: 200, contentType, response: "" }),
		};
		const validator: OverpassQueryValidator = {
			validate: (_1, _2, format) => {
				resolve(format);
				return null!;
			},
		};
		const api = new OverpassApiObjectImp(adapter, null!, null!, validator, null!, null!, null!, null!, null!);
		api.execQuery("");
	});
}

export function apiMethodsTests() {
	it("Should run queries with exec", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.exec(JSON_FORMAT, uruguayStatementBuilder, ONLY_IDS);

		expectUruguay(result);
	});

	it("Should run queries with execJson", async () => {
		const api: OverpassApiObject = BuildApi();

		const result = await api.execJson(uruguayStatementBuilder, ONLY_IDS);

		expectUruguay(result);
	});

	it("Should run queries with execQuery", async () => {
		const api: OverpassApiObject = BuildApi();

		const query = api.buildQuery(uruguayStatementBuilder, ONLY_IDS, JSON_FORMAT);
		const result = await api.execQuery(query);

		expectUruguay(result);
	});

	it("Should handle multiple or single statements in buildQuery", () => {
		const api: OverpassApiObject = BuildApi();

		const single = api.buildQuery((s) => s.relation.byId(0), ONLY_IDS, JSON_FORMAT);
		const multi = api.buildQuery((s) => [s.relation.byId(0)], ONLY_IDS, JSON_FORMAT);

		expect(single).toEqual(multi);
	});

	it("Should not allow params in buildQuery", () => {
		const api: OverpassApiObject = BuildApi();

		const param: ParamItem<number> = { index: 0, type: ParamType.Number };

		const fn = () => api.buildQuery((s) => s.statement((u) => u.number(param)));

		expect(fn).toThrow(Error);
	});

	it("Should identify format based on contentType", async () => {
		const undef = await getUnknownFormat(undefined);

		expect(undef).toBeUndefined();

		const csv = await getUnknownFormat(TEXT_CSV);

		expect(csv).toBe(OverpassFormat.CSV);

		const xml = await getUnknownFormat(APP_OSM_XML);

		expect(xml).toBe(OverpassFormat.XML);
	});
}
