import { expect, it } from "@jest/globals";
import {
	OverpassApiObject,
	OverpassBoundingBox,
	OverpassGeoPos,
	OverpassQueryTarget,
	ParamItem,
	ParamType,
} from "../../src";
import {
	palacLegId as PAL_LEG_ID,
	buildApi,
	mdeoLabelId,
	montevideoBBox,
	montevideoId,
	onlyIds,
	plazaIndepId,
} from "../utils";

export function functionsParamTests() {
	it("Should allow number params", async () => {
		const api: OverpassApiObject = buildApi();

		const getById = api.createFunction(
			[ParamType.Number],
			(state, id: ParamItem<number>) => [state.node.byId(id)],
			onlyIds,
		);

		const mdeoRes = await getById(montevideoId);

		expect(mdeoRes.elements.length).toBe(1);
		const [mdeo] = mdeoRes.elements;

		expect(mdeo.id).toEqual(montevideoId);
		expect(mdeo.type).toBe("node");

		const mdeoLabelRes = await getById(mdeoLabelId);

		expect(mdeoLabelRes.elements.length).toBe(1);
		const [mdeoLabel] = mdeoLabelRes.elements;

		expect(mdeoLabel.id).toEqual(mdeoLabelId);
		expect(mdeoLabel.type).toBe("node");
	});

	it("Should allow regexp params", async () => {
		const api: OverpassApiObject = buildApi();

		const getByName = api.createFunction(
			[ParamType.Target, ParamType.RegExp],
			(state, target: ParamItem<OverpassQueryTarget>, name: ParamItem<RegExp>) => [state.query(target, { name })],
			onlyIds,
		);

		const resPIndep = await getByName(OverpassQueryTarget.Relation, /Plaza Independ/);

		expect(resPIndep.elements.length).toBe(1);
		const [pIndep] = resPIndep.elements;

		expect(pIndep.id).toEqual(plazaIndepId);
		expect(pIndep.type).toBe("relation");

		const resPalLeg = await getByName(OverpassQueryTarget.Way, /Palacio Leg/);

		expect(resPalLeg.elements.length).toBe(1);
		const [palLeg] = resPalLeg.elements;

		expect(palLeg.id).toEqual(PAL_LEG_ID);
		expect(palLeg.type).toBe("way");
	});

	it("Should allow regexp props", async () => {
		const api: OverpassApiObject = buildApi();

		const getByName = api.createFunction(
			[ParamType.Target, ParamType.RegExp, ParamType.RegExp],
			(state, target: ParamItem<OverpassQueryTarget>, prop: ParamItem<RegExp>, value: ParamItem<RegExp>) => [
				state.query(target, [[prop, value]]),
			],
			onlyIds,
		);

		const resPIndep = await getByName(OverpassQueryTarget.Relation, /^nam.$/, /Plaza Independ/);

		expect(resPIndep.elements.length).toBe(1);
		const [pIndep] = resPIndep.elements;

		expect(pIndep.id).toEqual(plazaIndepId);
		expect(pIndep.type).toBe("relation");

		const resPalLeg = await getByName(OverpassQueryTarget.Way, /^nam.$/, /Palacio Leg/);

		expect(resPalLeg.elements.length).toBe(1);
		const [palLeg] = resPalLeg.elements;

		expect(palLeg.id).toEqual(PAL_LEG_ID);
		expect(palLeg.type).toBe("way");
	});

	it("Should allow string params", async () => {
		const api: OverpassApiObject = buildApi();

		const containsProp = api.createFunction(
			[ParamType.String],
			(state, prop: ParamItem<string>) => [
				state.query(OverpassQueryTarget.NodeWayRelation, (b) => [[prop, b.exists()]]),
			],
			onlyIds,
			{ globalBoundingBox: montevideoBBox },
		);

		const containsCapRes = await containsProp("capital");

		expect(containsCapRes.elements.length).toBe(1);
		const [cap] = containsCapRes.elements;

		expect(cap.id).toEqual(montevideoId);
		expect(cap.type).toBe("node");

		const containsCapCityRes = await containsProp("capital_city");

		expect(containsCapCityRes.elements.length).toBe(1);
		const [capCity] = containsCapCityRes.elements;

		expect(capCity.id).toEqual(mdeoLabelId);
		expect(capCity.type).toBe("node");
	});

	it("Should allow bbox params", async () => {
		const api: OverpassApiObject = buildApi();

		const inBbox = api.createFunction(
			[ParamType.BoundingBox],
			(state, bbox: ParamItem<OverpassBoundingBox>) => [state.node.bbox(bbox)],
			onlyIds,
		);

		const mdeoLabelBbox: OverpassBoundingBox = [-34.8652724, -56.1819512, -34.8652724, -56.1819512];

		const mdeoLabelRes = await inBbox(mdeoLabelBbox);

		expect(mdeoLabelRes.elements.length).toBe(1);
		const [mdeoLabel] = mdeoLabelRes.elements;

		expect(mdeoLabel.id).toBe(mdeoLabelId);
		expect(mdeoLabel.type).toBe("node");

		const mdeoBbox: OverpassBoundingBox = [-34.9058916, -56.1913095, -34.9058916, -56.1913095];

		const mdeoRes = await inBbox(mdeoBbox);

		expect(mdeoRes.elements.length).toBe(1);
		const [mdeo] = mdeoRes.elements;

		expect(mdeo.id).toBe(montevideoId);
		expect(mdeo.type).toBe("node");
	});

	it("Should allow geopos params", async () => {
		const api: OverpassApiObject = buildApi();

		const inside = api.createFunction(
			[ParamType.GeoPos],
			(state, pos: ParamItem<OverpassGeoPos>) => [state.node.inside([pos, pos, pos])],
			onlyIds,
		);

		const mdeoLabelGeoPos: OverpassGeoPos = { lat: -34.8652724, lon: -56.1819512 };

		const mdeoLabelRes = await inside(mdeoLabelGeoPos);

		expect(mdeoLabelRes.elements.length).toBe(1);
		const [mdeoLabel] = mdeoLabelRes.elements;

		expect(mdeoLabel.id).toBe(mdeoLabelId);
		expect(mdeoLabel.type).toBe("node");

		const mdeoBboxGeoPos: OverpassGeoPos = { lat: -34.9058916, lon: -56.1913095 };

		const mdeoRes = await inside(mdeoBboxGeoPos);

		expect(mdeoRes.elements.length).toBe(1);
		const [mdeo] = mdeoRes.elements;

		expect(mdeo.id).toBe(montevideoId);
		expect(mdeo.type).toBe("node");
	});
}
