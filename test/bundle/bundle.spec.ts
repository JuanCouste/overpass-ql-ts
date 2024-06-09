import "?/checkConnection";
//
import { GetEnvTimeout, ParseYesNo } from "?/utils/env";
import { afterAll, beforeAll, describe } from "@jest/globals";
import { browserTests } from "./browser";
import { nodeTests } from "./node";
import { cleanupBundles, setupBundles } from "./setupBundles";

/** For information regarding tests see /test/README.md */

(ParseYesNo("OVERPASS_QL_BUNDLING", false) ? describe : describe.skip)("Bundle [Optional]", () => {
	beforeAll(setupBundles, GetEnvTimeout(7));

	describe("Node", nodeTests);

	if (process.env.OVERPASS_QL_BROWSER != null) {
		describe("Browser", browserTests);
	}

	afterAll(cleanupBundles);
});
