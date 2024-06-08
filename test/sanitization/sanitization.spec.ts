import { NaiveOverpassStringSanitizer } from "@/imp";
import { OverpassStringSanitizer, StringQuoteType } from "@/model";
import { describe, expect, it } from "@jest/globals";

/** For information regarding tests see /test/README.md */

describe("Naive string sanitizer", () => {
	it("Should not escape quotes other than the specified", () => {
		const sanitizer = new NaiveOverpassStringSanitizer();

		expect(sanitizer.sanitize('"Test"', StringQuoteType.Single)).toEqual('"Test"');

		expect(sanitizer.sanitize("'Test'", StringQuoteType.Double)).toEqual("'Test'");
	});

	it("Should escape correct quotes", () => {
		const sanitizer = new NaiveOverpassStringSanitizer();

		expect(sanitizer.sanitize("'Test'", StringQuoteType.Single)).toEqual("\\'Test\\'");

		expect(sanitizer.sanitize('"Test"', StringQuoteType.Double)).toEqual('\\"Test\\"');
	});

	it("Should not allow for escaping the closing quote", () => {
		const sanitizer = new NaiveOverpassStringSanitizer();

		const a: OverpassStringSanitizer = null!;

		sanitizer.sanitize("");

		expect(sanitizer.sanitize("Test\\")).not.toEqual("Test\\");
	});

	['"', "'", "n", "t"].forEach((char) => {
		it(`Should not double escape ${char}`, () => {
			const sanitizer = new NaiveOverpassStringSanitizer();

			const theString = `\\${char}Test\\${char}`;

			expect(sanitizer.sanitize(theString)).toEqual(theString);
		});
	});

	it("Should not repeat unnecesary escapes", () => {
		const sanitizer = new NaiveOverpassStringSanitizer();

		expect(sanitizer.sanitize("\\\\Test\\\\")).toEqual("\\\\Test\\\\");
	});

	it("Should complete single escapes", () => {
		const sanitizer = new NaiveOverpassStringSanitizer();

		expect(sanitizer.sanitize("\\Test")).toEqual("\\\\Test");
	});
});
