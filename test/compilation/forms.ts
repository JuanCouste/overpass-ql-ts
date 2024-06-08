import { MDEO_BBOX, MDEO_ID, NOT_AN_API } from "?/utils";
import { PolygonFromBBox } from "?/utils/functions";
import { BuildOverpassApi } from "@/imp";
import {
	OverpassApiObject,
	OverpassQueryTagFilterTuple,
	OverpassQueryTagFitlerObject,
	OverpassQueryTarget,
	OverpassQueryTargetString,
	OverpassStatement,
	OverpassTargetState,
} from "@/model";
import { expect, it } from "@jest/globals";

export function targetFormTests() {
	it(`Should build around center for all targets`, () =>
		CheckAllFormsOfStatement((target) => target.aroundCenter(100, { lat: 10, lon: 10 })));

	it(`Should build around set for all targets`, () =>
		CheckAllFormsOfStatement((target) => target.aroundSet(100, "set")));

	it(`Should build around line for all targets`, () =>
		CheckAllFormsOfStatement((target) => target.aroundLine(100, [[10, 2], { lat: 10, lon: 2 }])));

	it(`Should build bbox for all targets`, () => CheckAllFormsOfStatement((target) => target.bbox(MDEO_BBOX)));

	it(`Should build byTags for all targets`, () =>
		CheckAllFormsOfStatement((target) => target.byTags({ name: "Test" })));

	it("Should build byTags queries with string values", () =>
		CheckAllFormsOfByTags({ name: "Montevideo", capital: "yes" }));

	it("Should build byTags queries with regexp values", () =>
		CheckAllFormsOfByTags({ name: "Montevideo", capital: /^yes$/ }));

	it("Should build byTags regexp queries", () => CheckAllFormsOfByTags({ name: /^Montevideo$/, capital: /^yes$/ }));

	it(`Should build byId for all targets`, () => CheckAllFormsOfStatement((target) => target.byId(MDEO_ID)));

	it(`Should build filter for all targets`, () =>
		CheckAllFormsOfStatement((target) => target.filter((e) => e.boolean(true))));

	it(`Should build inside polygon for all targets`, () =>
		CheckAllFormsOfStatement((target) => target.inside(PolygonFromBBox(MDEO_BBOX))));
}

const TARGETS: [OverpassQueryTargetString, OverpassQueryTarget][] = [
	["relation", OverpassQueryTarget.Relation],
	["node", OverpassQueryTarget.Node],
	["way", OverpassQueryTarget.Way],
	["any", OverpassQueryTarget.NodeWayRelation],
];

function CheckAllFormsOfStatement(callback: (state: OverpassTargetState) => OverpassStatement): void {
	const api: OverpassApiObject = BuildOverpassApi(null!, { interpreterUrl: NOT_AN_API });

	TARGETS.forEach((subTargets) => {
		const forms = subTargets
			.map((target) => [
				api.buildQuery((s) => callback(s[target])),
				api.buildQuery((s) =>
					callback(
						new Proxy<OverpassTargetState>({} as OverpassTargetState, {
							get:
								(_, methodName) =>
								(...methodArgs: any[]) =>
									s[methodName as keyof OverpassTargetState](target, ...methodArgs),
						}),
					),
				),
			])
			.flat();

		for (let i = 1; i < forms.length; i++) {
			expect(forms[i]).toEqual(forms[0]);
		}
	});
}

function CheckAllFormsOfByTags(tags: OverpassQueryTagFitlerObject): void {
	const tupleArray = Object.entries(tags) as OverpassQueryTagFilterTuple[];

	const api: OverpassApiObject = BuildOverpassApi(null!, { interpreterUrl: NOT_AN_API });

	const forms = [
		api.buildQuery((s) => [s.node.byTags(tags)]),
		api.buildQuery((s) => [s.node.byTags(tupleArray)]),
		api.buildQuery((s) => [s.node.byTags(() => tags)]),
		api.buildQuery((s) => [s.node.byTags(() => tupleArray)]),
	];

	for (let i = 1; i < forms.length; i++) {
		expect(forms[i]).toEqual(forms[0]);
	}
}
