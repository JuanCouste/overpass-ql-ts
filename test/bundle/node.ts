import { MDEO_BBOX, URUGUAY_ID } from "?/utils";
import { OverpassApiObject, OverpassJsonOutput, OverpassSettingsNoFormat, OverpassState } from "@/index";
import { beforeAll, expect, it } from "@jest/globals";
import { CJS_BUNDLE, OverpassQlTsModule } from "./setupBundles";

export function nodeTests() {
	let module: OverpassQlTsModule;

	beforeAll(async () => (module = await import(`./output/${CJS_BUNDLE}`)));

	it("Should fetch status with cjs bundle", async () => {
		const api: OverpassApiObject = module.HttpOverpassApi(process.env.OVERPASS_QL_TS_URL!);

		const status = await api.status();

		expect(status).toHaveProperty("connectedAs");
		expect(status).toHaveProperty("currentTime");
		expect(status).toHaveProperty("ratelimit");
		expect(status).toHaveProperty("aviableSlots");
		expect(status).toHaveProperty("runningQueries");
	});

	it("Should run query with cjs bundle", async () => {
		const api: OverpassApiObject = module.HttpOverpassApi(process.env.OVERPASS_QL_TS_URL!);
		const settings: OverpassSettingsNoFormat = { globalBoundingBox: MDEO_BBOX };

		const result = await api.execJson(
			(s: OverpassState) => [s.relation.byTags({ name: "Uruguay" })],
			undefined,
			settings,
		);

		const { elements } = result as OverpassJsonOutput;

		expect(elements.length).toEqual(1);

		const [element] = elements;

		expect(element.id).toEqual(URUGUAY_ID);
		expect(element.type).toBe("relation");
	});
}
