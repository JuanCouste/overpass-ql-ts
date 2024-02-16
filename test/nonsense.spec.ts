import { describe, it } from "@jest/globals";
import { OverpassError } from "../src";

describe("Nonsense", () => {
	it("Should not affect coverage", async () => {
		new OverpassError(0);
	});
});
