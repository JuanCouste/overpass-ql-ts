import { afterAll, beforeAll, expect, it } from "@jest/globals";
import { Browser } from "puppeteer-core";
import { OverpassApiObject, OverpassJsonOutput, OverpassSettingsNoFormat, OverpassState } from "../../src";
import { montevideoBBox, uruguayId } from "../testContext";
import { cleanupBrowser, runTestInBrowser, setupBrowser } from "./setupBrowser";

export function browserTests() {
	let browser: Browser;

	beforeAll(async () => (browser = await setupBrowser()), 10000);

	it("Should fetch status in browser script", async () => {
		const status = await runTestInBrowser(browser, async (module, url) => {
			const api: OverpassApiObject = module.DefaultOverpassApi(url);
			return await api.status();
		});

		expect(status).toHaveProperty("connectedAs");
		expect(status).toHaveProperty("currentTime");
		expect(status).toHaveProperty("ratelimit");
		expect(status).toHaveProperty("aviableSlots");
		expect(status).toHaveProperty("runningQueries");
	}, 5000);

	it("Should run query in browser script", async () => {
		const { elements } = await runTestInBrowser(
			browser,
			async (module, url, montevideoBBox) => {
				const api: OverpassApiObject = module.DefaultOverpassApi(url);
				const settings: OverpassSettingsNoFormat = { globalBoundingBox: montevideoBBox };
				const result = await api.execJson(
					(s: OverpassState) => [s.relation.query({ name: "Uruguay" })],
					undefined,
					settings,
				);
				return result as OverpassJsonOutput;
			},
			montevideoBBox,
		);

		expect(elements.length).toEqual(1);

		const [element] = elements;

		expect(element.id).toEqual(uruguayId);
		expect(element.type).toBe("relation");
	}, 5000);

	afterAll(async () => await cleanupBrowser(browser));
}
