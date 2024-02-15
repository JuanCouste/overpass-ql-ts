import { beforeAll, expect, it } from "@jest/globals";
import { OverpassApiObject, OverpassJsonOutput, OverpassSettingsNoFormat, OverpassState } from "../../src";
import { montevideoBBox, uruguayId } from "../testContext";
import { CJS_BUNDLE, OverpassQlTsModule } from "./setupBundles";

export function nodeTests() {
	let module: OverpassQlTsModule;

	beforeAll(async () => (module = await import(`./output/${CJS_BUNDLE}`)));

	it("Should fetch status with cjs bundle", async () => {
		const api: OverpassApiObject = module.DefaultOverpassApi(process.env.OVERPASS_QL_TS_URL!);

		const status = await api.status();

		expect(status).toHaveProperty("connectedAs");
		expect(status).toHaveProperty("currentTime");
		expect(status).toHaveProperty("ratelimit");
		expect(status).toHaveProperty("aviableSlots");
		expect(status).toHaveProperty("runningQueries");
	});

	it("Should run query with cjs bundle", async () => {
		const api: OverpassApiObject = module.DefaultOverpassApi(process.env.OVERPASS_QL_TS_URL!);
		const settings: OverpassSettingsNoFormat = { globalBoundingBox: montevideoBBox };

		const result = await api.execJson(
			(s: OverpassState) => [s.relation.query({ name: "Uruguay" })],
			undefined,
			settings,
		);

		const { elements } = result as OverpassJsonOutput;

		expect(elements.length).toEqual(1);

		const [element] = elements;

		expect(element.id).toEqual(uruguayId);
		expect(element.type).toBe("relation");
	});
}