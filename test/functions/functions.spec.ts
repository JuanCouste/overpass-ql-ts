import "../setup/checkConnection";
//
import { describe, expect, it } from "@jest/globals";
import { OverpassApiObject, OverpassJsonOutput, OverpassQueryTarget, ParamItem, ParamType } from "../../src";
import { BuildApi, MDEO_ID, ONLY_IDS, URUGUAY_ID } from "../utils";
import { functionsParamTests } from "./params";

describe("Statement", () => {
	describe("Params", functionsParamTests);

	it("Should allow empty prepared functions", async () => {
		const api: OverpassApiObject = BuildApi();

		const getMdeo = api.createFunction([], (state) => [state.node.byId(MDEO_ID)], ONLY_IDS);

		const result = (await getMdeo()) as OverpassJsonOutput;

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should allow other way of creating functions", async () => {
		const api: OverpassApiObject = BuildApi();

		const getMdeo = api.createFunction([], (state) => ({
			statements: [state.node.byId(MDEO_ID)],
			outpOptions: ONLY_IDS,
		}));

		const result = (await getMdeo()) as OverpassJsonOutput;

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should allow single statement create function", async () => {
		const api: OverpassApiObject = BuildApi();

		const getMdeo = api.createFunction([], (s) => s.node.byId(MDEO_ID));

		const result = (await getMdeo()) as OverpassJsonOutput;

		expect(result.elements.length).toBe(1);
		const [element] = result.elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should allow prepared functions with params", async () => {
		const api: OverpassApiObject = BuildApi();

		const getByTargetAndId = api.createFunction(
			[ParamType.Target, ParamType.Number],
			(state, target: ParamItem<OverpassQueryTarget>, id: ParamItem<number>) => [state.byId(target, id)],
			ONLY_IDS,
		);

		const resMdeo = (await getByTargetAndId(OverpassQueryTarget.Node, MDEO_ID)) as OverpassJsonOutput;

		expect(resMdeo.elements.length).toBe(1);
		const [mdeo] = resMdeo.elements;

		expect(mdeo.id).toEqual(MDEO_ID);
		expect(mdeo.type).toBe("node");

		const resUru = (await getByTargetAndId(OverpassQueryTarget.Relation, URUGUAY_ID)) as OverpassJsonOutput;

		expect(resUru.elements.length).toBe(1);
		const [uru] = resUru.elements;

		expect(uru.id).toEqual(URUGUAY_ID);
		expect(uru.type).toBe("relation");
	});
});
