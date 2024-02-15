import "../setup/checkConnection";
//
import { describe, expect, it } from "@jest/globals";
import { OverpassApiObject, OverpassJsonOutput, OverpassQueryTarget, ParamItem, ParamType } from "../../src";
import { buildApi } from "../setup/apiBuilder";
import { montevideoId, onlyIds, uruguayId } from "../testContext";
import { functionsParamTests } from "./params";

describe("Statement", () => {
	describe("Params", functionsParamTests);

	it("Should allow empty prepared functions", async () => {
		const api: OverpassApiObject = buildApi();

		const getMdeo = api.createFunction([], (state) => [state.node.byId(montevideoId)], onlyIds);

		const result = (await getMdeo()) as OverpassJsonOutput;

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(montevideoId);
		expect(element.type).toBe("node");
	});

	it("Should allow other way of creating functions", async () => {
		const api: OverpassApiObject = buildApi();

		const getMdeo = api.createFunction([], (state) => ({
			statements: [state.node.byId(montevideoId)],
			outpOptions: onlyIds,
		}));

		const result = (await getMdeo()) as OverpassJsonOutput;

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(montevideoId);
		expect(element.type).toBe("node");
	});

	it("Should allow single statement create function", async () => {
		const api: OverpassApiObject = buildApi();

		const getMdeo = api.createFunction([], (s) => s.node.byId(montevideoId));

		const result = (await getMdeo()) as OverpassJsonOutput;

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(montevideoId);
		expect(element.type).toBe("node");
	});

	it("Should allow prepared functions with params", async () => {
		const api: OverpassApiObject = buildApi();

		const getByTargetAndId = api.createFunction(
			[ParamType.Target, ParamType.Number],
			(state, target: ParamItem<OverpassQueryTarget>, id: ParamItem<number>) => [state.byId(target, id)],
			onlyIds,
		);

		const resMdeo = (await getByTargetAndId(OverpassQueryTarget.Node, montevideoId)) as OverpassJsonOutput;

		expect(resMdeo.elements.length).toBe(1);
		const [mdeo] = resMdeo.elements;

		expect(mdeo.id).toEqual(montevideoId);
		expect(mdeo.type).toBe("node");

		const resUru = (await getByTargetAndId(OverpassQueryTarget.Relation, uruguayId)) as OverpassJsonOutput;

		expect(resUru.elements.length).toBe(1);
		const [uru] = resUru.elements;

		expect(uru.id).toEqual(uruguayId);
		expect(uru.type).toBe("relation");
	});
});
