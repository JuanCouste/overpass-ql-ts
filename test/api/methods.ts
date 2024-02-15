import { expect, it } from "@jest/globals";
import {
	OverpassApiObject,
	OverpassApiObjectImp,
	OverpassFormat,
	OverpassQueryValidator,
	ParamType,
	RequestAdapter,
} from "../../src";
import { buildApi } from "../setup/apiBuilder";
import { jsonFormat, onlyIds } from "../testContext";
import { TEXT_CSV } from "../utils";
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
		const api = new OverpassApiObjectImp(adapter, null!, null!, validator, null!, null!, null!, null!);
		api.execQuery("");
	});
}

export function apiMethodsTests() {
	it("Should run queries with exec", async () => {
		const api: OverpassApiObject = buildApi();

		const result = await api.exec(jsonFormat, uruguayStatementBuilder, onlyIds);

		expectUruguay(result);
	});

	it("Should run queries with execJson", async () => {
		const api: OverpassApiObject = buildApi();

		const result = await api.execJson(uruguayStatementBuilder, onlyIds);

		expectUruguay(result);
	});

	it("Should run queries with execQuery", async () => {
		const api: OverpassApiObject = buildApi();

		const query = api.buildQuery(uruguayStatementBuilder, onlyIds, jsonFormat);
		const result = await api.execQuery(query);

		expectUruguay(result);
	});

	it("Should handle multiple or single statements in buildQuery", () => {
		const api: OverpassApiObject = buildApi();

		const single = api.buildQuery((s) => s.relation.byId(0), onlyIds, jsonFormat);
		const multi = api.buildQuery((s) => [s.relation.byId(0)], onlyIds, jsonFormat);

		expect(single).toEqual(multi);
	});

	it("Should not allow params in buildQuery", () => {
		const api: OverpassApiObject = buildApi();

		const fn = () => api.buildQuery((s) => ({ compile: (u) => u.number({ index: 0, type: ParamType.Number }) }));

		expect(fn).toThrow(Error);
	});

	it("Should identify format based on contentType", async () => {
		const undef = await getUnknownFormat(undefined);

		expect(undef).toBeUndefined();

		const csv = await getUnknownFormat(TEXT_CSV);

		expect(csv).toBe(OverpassFormat.CSV);
	});
}
