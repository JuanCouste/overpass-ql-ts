import { afterAll, beforeAll } from "@jest/globals";
import { baseConfig } from "../../jest.config";
import { buildApi } from "../utils";

let promises: Promise<void>[];

beforeAll(async () => {
	if (process.env.OVERPASS_QL_TS_URL == null) {
		console.error("You must set OVERPASS_QL_TS_URL env variable to point to an /api/interpreter.");
		console.error("You can use a .env file");
		process.exit(1);
	}

	try {
		promises = [
			buildApi()
				.status()
				.then(() => {}),
			new Promise<void>((_, reject) => setTimeout(reject, baseConfig.testTimeout! * 0.9)),
		];

		await Promise.race(promises);
	} catch (error) {
		console.error("Error api unreachable", error);
		process.exit(1);
	}
});

/** Jest does not handle {@link Promise.race} very well ...*/
afterAll(async () => {
	try {
		await Promise.allSettled(promises);
	} catch (error) {}
});
