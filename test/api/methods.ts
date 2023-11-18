import { it } from "@jest/globals";
import { OverpassApiObject } from "../../src";
import { buildApi } from "../setup/apiBuilder";
import { jsonFormat, onlyIds } from "../testContext";
import { expectUruguay, uruguayStatementBuilder } from "./uruguay";

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
}
