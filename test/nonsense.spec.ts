import { OverpassError } from "@/index";
import { describe, it } from "@jest/globals";

describe("Nonsense", () => {
	it("Should not affect coverage", async () => {
		new OverpassError(0);
	});
});
