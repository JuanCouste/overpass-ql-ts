import { MDEO_BBOX, URUGUAY_ID } from "?/utils";
import { GetEnvTimeout } from "?/utils/env";
import { OverpassApiObject, OverpassJsonOutput, OverpassSettingsNoFormat, OverpassState } from "@/index";
import { afterAll, beforeAll, expect, it } from "@jest/globals";
import { Browser } from "puppeteer-core";
import { cleanupBrowser, runTestInBrowser, setupBrowser } from "./setupBrowser";

export function browserTests() {
	let browser: Browser;

	beforeAll(async () => (browser = await setupBrowser()), GetEnvTimeout(5));

	it(
		"Should fetch status in browser script",
		async () => {
			const status = await runTestInBrowser(browser, async (module, url) => {
				const api: OverpassApiObject = module.FetchOverpassApi({ interpreterUrl: url });
				return await api.status();
			});

			expect(status).toHaveProperty("connectedAs");
			expect(status).toHaveProperty("currentTime");
			expect(status).toHaveProperty("ratelimit");
			expect(status).toHaveProperty("aviableSlots");
			expect(status).toHaveProperty("runningQueries");
		},
		GetEnvTimeout(3),
	);

	it(
		"Should run query in browser script",
		async () => {
			const { elements } = await runTestInBrowser(
				browser,
				async (module, url, montevideoBBox) => {
					const api: OverpassApiObject = module.FetchOverpassApi({ interpreterUrl: url });
					const settings: OverpassSettingsNoFormat = { globalBoundingBox: montevideoBBox };
					const result = await api.execJson(
						(s: OverpassState) => [s.relation.byTags({ name: "Uruguay" })],
						undefined,
						settings,
					);
					return result as OverpassJsonOutput;
				},
				MDEO_BBOX,
			);

			expect(elements.length).toEqual(1);

			const [element] = elements;

			expect(element.id).toEqual(URUGUAY_ID);
			expect(element.type).toBe("relation");
		},
		GetEnvTimeout(3),
	);

	afterAll(async () => await cleanupBrowser(browser));
}
