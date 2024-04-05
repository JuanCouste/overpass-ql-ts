import { BuildApi, MDEO_BBOX, MDEO_ID, MDEO_LABEL_ID, ONLY_IDS, PAL_LEG_ID, PLAZA_INDEP_ID } from "?/utils";
import {
	OverpassApiObject,
	OverpassBoundingBox,
	OverpassGeoPos,
	OverpassQueryTarget,
	ParamItem,
	ParamType,
} from "@/index";
import { expect, it } from "@jest/globals";

export function functionsParamTests() {
	it("Should allow number params", async () => {
		const api: OverpassApiObject = BuildApi();

		const getById = api.createFunction(
			[ParamType.Number],
			(state, id: ParamItem<number>) => [state.node.byId(id)],
			ONLY_IDS,
		);

		const mdeoRes = await getById(MDEO_ID);

		expect(mdeoRes.elements.length).toBe(1);
		const [mdeo] = mdeoRes.elements;

		expect(mdeo.id).toEqual(MDEO_ID);
		expect(mdeo.type).toBe("node");

		const mdeoLabelRes = await getById(MDEO_LABEL_ID);

		expect(mdeoLabelRes.elements.length).toBe(1);
		const [mdeoLabel] = mdeoLabelRes.elements;

		expect(mdeoLabel.id).toEqual(MDEO_LABEL_ID);
		expect(mdeoLabel.type).toBe("node");
	});

	it("Should allow regexp params", async () => {
		const api: OverpassApiObject = BuildApi();

		const getByName = api.createFunction(
			[ParamType.Target, ParamType.RegExp],
			(state, target: ParamItem<OverpassQueryTarget>, name: ParamItem<RegExp>) => [state.query(target, { name })],
			ONLY_IDS,
		);

		const resPIndep = await getByName(OverpassQueryTarget.Relation, /Plaza Independ/);

		expect(resPIndep.elements.length).toBe(1);
		const [pIndep] = resPIndep.elements;

		expect(pIndep.id).toEqual(PLAZA_INDEP_ID);
		expect(pIndep.type).toBe("relation");

		const resPalLeg = await getByName(OverpassQueryTarget.Way, /Palacio Leg/);

		expect(resPalLeg.elements.length).toBe(1);
		const [palLeg] = resPalLeg.elements;

		expect(palLeg.id).toEqual(PAL_LEG_ID);
		expect(palLeg.type).toBe("way");
	});

	it("Should allow regexp props", async () => {
		const api: OverpassApiObject = BuildApi();

		const getByName = api.createFunction(
			[ParamType.Target, ParamType.RegExp, ParamType.RegExp],
			(state, target: ParamItem<OverpassQueryTarget>, prop: ParamItem<RegExp>, value: ParamItem<RegExp>) => [
				state.query(target, [[prop, value]]),
			],
			ONLY_IDS,
		);

		const resPIndep = await getByName(OverpassQueryTarget.Relation, /^nam.$/, /Plaza Independ/);

		expect(resPIndep.elements.length).toBe(1);
		const [pIndep] = resPIndep.elements;

		expect(pIndep.id).toEqual(PLAZA_INDEP_ID);
		expect(pIndep.type).toBe("relation");

		const resPalLeg = await getByName(OverpassQueryTarget.Way, /^nam.$/, /Palacio Leg/);

		expect(resPalLeg.elements.length).toBe(1);
		const [palLeg] = resPalLeg.elements;

		expect(palLeg.id).toEqual(PAL_LEG_ID);
		expect(palLeg.type).toBe("way");
	});

	it("Should allow string params", async () => {
		const api: OverpassApiObject = BuildApi();

		const containsProp = api.createFunction(
			[ParamType.String],
			(state, prop: ParamItem<string>) => [
				state.query(OverpassQueryTarget.NodeWayRelation, (b) => [[prop, b.exists()]]),
			],
			ONLY_IDS,
			{ globalBoundingBox: MDEO_BBOX },
		);

		await Promise.all([
			(async function () {
				const containsCapRes = await containsProp("capital");

				expect(containsCapRes.elements.length).toBe(1);
				const [cap] = containsCapRes.elements;

				expect(cap.id).toEqual(MDEO_ID);
				expect(cap.type).toBe("node");
			})(),
			(async function () {
				const containsCapCityRes = await containsProp("capital_city");

				expect(containsCapCityRes.elements.length).toBe(1);
				const [capCity] = containsCapCityRes.elements;

				expect(capCity.id).toEqual(MDEO_LABEL_ID);
				expect(capCity.type).toBe("node");
			})(),
		]);
	});

	it("Should allow bbox params", async () => {
		const api: OverpassApiObject = BuildApi();

		const inBbox = api.createFunction(
			[ParamType.BoundingBox],
			(state, bbox: ParamItem<OverpassBoundingBox>) => [state.node.bbox(bbox)],
			ONLY_IDS,
		);

		const mdeoLabelBbox: OverpassBoundingBox = [-34.8652724, -56.1819512, -34.8652724, -56.1819512];

		const mdeoLabelRes = await inBbox(mdeoLabelBbox);

		expect(mdeoLabelRes.elements.length).toBe(1);
		const [mdeoLabel] = mdeoLabelRes.elements;

		expect(mdeoLabel.id).toBe(MDEO_LABEL_ID);
		expect(mdeoLabel.type).toBe("node");

		const mdeoBbox: OverpassBoundingBox = [-34.9058916, -56.1913095, -34.9058916, -56.1913095];

		const mdeoRes = await inBbox(mdeoBbox);

		expect(mdeoRes.elements.length).toBe(1);
		const [mdeo] = mdeoRes.elements;

		expect(mdeo.id).toBe(MDEO_ID);
		expect(mdeo.type).toBe("node");
	});

	it("Should allow geopos params", async () => {
		const api: OverpassApiObject = BuildApi();

		const inside = api.createFunction(
			[ParamType.GeoPos],
			(state, pos: ParamItem<OverpassGeoPos>) => [state.node.inside([pos, pos, pos])],
			ONLY_IDS,
		);

		const mdeoLabelGeoPos: OverpassGeoPos = { lat: -34.8652724, lon: -56.1819512 };

		const mdeoLabelRes = await inside(mdeoLabelGeoPos);

		expect(mdeoLabelRes.elements.length).toBe(1);
		const [mdeoLabel] = mdeoLabelRes.elements;

		expect(mdeoLabel.id).toBe(MDEO_LABEL_ID);
		expect(mdeoLabel.type).toBe("node");

		const mdeoBboxGeoPos: OverpassGeoPos = { lat: -34.9058916, lon: -56.1913095 };

		const mdeoRes = await inside(mdeoBboxGeoPos);

		expect(mdeoRes.elements.length).toBe(1);
		const [mdeo] = mdeoRes.elements;

		expect(mdeo.id).toBe(MDEO_ID);
		expect(mdeo.type).toBe("node");
	});
}
