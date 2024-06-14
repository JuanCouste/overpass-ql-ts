import { BuildApi } from "?/utils";
import {
	AnyOverpassElement,
	OverpassApiObject,
	OverpassBasicElementType,
	OverpassOsmElement,
	OverpassOutputVerbosity,
	OverpassQueryTarget,
	OverpassRecurseStmType,
} from "@/index";
import { it } from "@jest/globals";
import expect from "expect";

const trafficLightsId = 2349463356;
const crossingIds = 11218346838;

function expectPIndepResult(elements: AnyOverpassElement[]) {
	expect(elements.length).toBe(6);

	const trafficItems = elements.slice(0, 3) as OverpassOsmElement<OverpassBasicElementType>[];

	expect(trafficItems[0].id).toBe(trafficLightsId);
	expect(trafficItems[1].tags!["name"]).toEqual("Plaza Independencia");
	expect(trafficItems[2].tags).toHaveProperty("highway");

	const crossItems = elements.slice(3, 6) as OverpassOsmElement<OverpassBasicElementType>[];

	expect(crossItems[0].id).toBe(crossingIds);
	expect(crossItems[1].tags!["name"]).toEqual("Plaza Independencia");
	expect(crossItems[2].tags).toHaveProperty("highway");
}

export function standaloneForEachTests() {
	it("Should handle foreach query", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson(
			(s) => [
				s.node.byId([trafficLightsId, crossingIds]),
				s.forEach(() => [
					s.out({ verbosity: OverpassOutputVerbosity.Ids }),
					s.recurse(OverpassRecurseStmType.Up).toSet("up"),
					s.set(OverpassQueryTarget.Way, "up").toSet("up_ways"),
					s.out({ targetSet: "up_ways", verbosity: OverpassOutputVerbosity.Metadata }),
				]),
			],
			{ targetSet: "empty" },
		);

		expectPIndepResult(elements);
	});

	it("Should handle foreach query with custom set", async () => {
		const api: OverpassApiObject = BuildApi();

		const trafficLightsId = 2349463356;
		const crossingIds = 11218346838;

		const { elements } = await api.execJson(
			(s) => [
				s.node.byId(1).difference(s.node.byId(1)),
				s.node.byId([trafficLightsId, crossingIds]).toSet("set"),
				s.forEach("set", () => [
					s.out({ verbosity: OverpassOutputVerbosity.Ids }),
					s.recurse(OverpassRecurseStmType.Up).toSet("up"),
					s.set(OverpassQueryTarget.Way, "up").toSet("up_ways"),
					s.out({ targetSet: "up_ways", verbosity: OverpassOutputVerbosity.Metadata }),
				]),
			],
			{ targetSet: "empty" },
		);

		expectPIndepResult(elements);
	});

	it("Should handle foreach query with custom item and set", async () => {
		const api: OverpassApiObject = BuildApi();

		const trafficLightsId = 2349463356;
		const crossingIds = 11218346838;

		const { elements } = await api.execJson(
			(s) => [
				s.node.byId(1).difference(s.node.byId(1)),
				s.node.byId([trafficLightsId, crossingIds]).toSet("set"),
				s.forEach("set", "item", () => [
					s.out({ targetSet: "item", verbosity: OverpassOutputVerbosity.Ids }),
					s.recurse(OverpassRecurseStmType.Up, "item").toSet("up"),
					s.set(OverpassQueryTarget.Way, "up").toSet("up_ways"),
					s.out({ targetSet: "up_ways", verbosity: OverpassOutputVerbosity.Metadata }),
				]),
			],
			{ targetSet: "empty" },
		);

		expectPIndepResult(elements);
	});

	it("Should handle foreach empty", async () => {
		const api: OverpassApiObject = BuildApi();

		const trafficLightsId = 2349463356;
		const crossingIds = 11218346838;

		const { elements } = await api.execJson(
			(s) => [
				s.node.byId([trafficLightsId, crossingIds]),
				s.forEach(() => s.out({ verbosity: OverpassOutputVerbosity.Ids })),
			],
			{ targetSet: "empty" },
		);

		expect(elements.length).toBe(2);

		const ids = elements.map((el) => el.id);
		ids.sort();

		expect(ids).toEqual([crossingIds, trafficLightsId]);
	});
}
