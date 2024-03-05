import "?/checkConnection";
//
import { afterAll, beforeAll, describe } from "@jest/globals";
import { browserTests } from "./browser";
import { nodeTests } from "./node";
import { cleanupBundles, setupBundles } from "./setupBundles";

function shouldDoBundlingTests(): boolean {
	switch (process.env.OVERPASS_QL_BUNDLING?.toLocaleLowerCase()) {
		case "yes":
		case "y":
		case "true":
			return true;
		case "no":
		case "n":
		case "false":
		default:
			return false;
	}
}

(shouldDoBundlingTests() ? describe : describe.skip)("Bundle [Optional]", () => {
	beforeAll(setupBundles, 15000);

	describe("Node", nodeTests);

	if (process.env.OVERPASS_QL_BROWSER != null) {
		describe("Browser", browserTests);
	}

	afterAll(cleanupBundles);
});
