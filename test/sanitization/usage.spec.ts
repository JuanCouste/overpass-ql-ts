import "../checkConnection";
//
import { OverpassApiObject, OverpassSettingsNoFormat, OverpassState, OverpassStatement } from "@/index";
import { describe, expect, it } from "@jest/globals";
import { BuildApi, ONLY_IDS } from "../utils";

/** For information regarding tests see /test/README.md */

async function CheckSanitizer(statementBuilder: (state: OverpassState) => OverpassStatement[] | OverpassStatement) {
	const settings: OverpassSettingsNoFormat = { globalBoundingBox: [0, 0, 0, 0] };

	const apiWithSanitizer: OverpassApiObject = BuildApi(undefined, { sanitization: true });
	const apiWithoutSanitizer: OverpassApiObject = BuildApi(undefined, { sanitization: false });

	await expect(apiWithSanitizer.execJson(statementBuilder, ONLY_IDS, settings)).resolves.toBeDefined();

	await expect(apiWithoutSanitizer.execJson(statementBuilder, ONLY_IDS, settings)).rejects.toThrowError(Error);
}

describe("String sanitizer usage", () => {
	it("Should sanitize tag equals", async () => {
		await CheckSanitizer((s) => s.node.byTags((b) => ({ ["name\\"]: b.equals("Montevideo") })));
	});

	it("Should sanitize tag exits", async () => {
		await CheckSanitizer((s) => s.node.byTags((b) => ({ ["name\\"]: b.exists() })));
	});

	it("Should sanitize tag exits", async () => {
		await CheckSanitizer((s) => s.node.byTags((b) => ({ ["name\\"]: b.regExp(/test/) })));
	});

	it("Should sanitize string literals", async () => {
		await CheckSanitizer((s) => s.node.filter((e) => e.string("test\\").eq("1")));
	});
});
