import { expect, it } from "@jest/globals";
import {
	AnyOverpassElement,
	OverpassErrorType,
	OverpassFormat,
	OverpassJsonOutput,
	OverpassJsonSettings,
	OverpassOutputOptions,
	OverpassRemarkError,
	OverpassSettings,
} from "../../src";
import { OverpassQueryValidatorImp } from "../../src/imp/api/validator";
import { APP_JSON, memoryExhaustionRemark, noAtticRemark, timeoutRemark, unknownRemark } from "../utils";

function validateJson(output: OverpassJsonOutput) {
	const validator = new OverpassQueryValidatorImp(null!);

	return validator.validate<OverpassJsonSettings<OverpassSettings>, OverpassOutputOptions>(
		"",
		{ status: 200, contentType: APP_JSON, response: JSON.stringify(output) },
		OverpassFormat.JSON,
	);
}

function validateJsonResult(elements: AnyOverpassElement[]): OverpassJsonOutput {
	return validateJson({
		version: 0.6,
		generator: "Overpass API 0.7.61.5 4133829e",
		osm3s: {
			timestamp_osm_base: "2024-02-08T04:29:26Z",
			copyright:
				"The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
		},
		elements,
	});
}

async function validateJsonRemark(remark: string) {
	return validateJson({
		version: 0.6,
		generator: "Overpass API 0.7.61.5 4133829e",
		osm3s: {
			timestamp_osm_base: "2024-02-08T04:29:26Z",
			copyright:
				"The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
		},
		elements: [],
		remark,
	});
}

export function apiValidatorJsonTests() {
	it("Should run with empty response", async () => {
		const result = validateJsonResult([]);

		expect(result.elements.length).toBe(0);
	});

	it("Should run with some elements", async () => {
		const result = validateJsonResult([{ id: 1 } as AnyOverpassElement]);

		expect(result.elements.length).toBe(1);
	});

	it("Should handle timeout remark", async () => {
		const resultPromise = validateJsonRemark(timeoutRemark);

		await expect(resultPromise).rejects.toThrow(OverpassRemarkError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.QueryTimeout);
	});

	it("Should handle memory exhaustion remark", async () => {
		const resultPromise = validateJsonRemark(memoryExhaustionRemark);

		await expect(resultPromise).rejects.toThrow(OverpassRemarkError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.MemoryExhaustionError);
	});

	it("Should handle no attic data remark", async () => {
		const resultPromise = validateJsonRemark(noAtticRemark);

		await expect(resultPromise).rejects.toThrow(OverpassRemarkError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.NoAtticData);
	});

	it("Should handle unknown remark", async () => {
		const resultPromise = validateJsonRemark(unknownRemark);

		await expect(resultPromise).rejects.toThrow(OverpassRemarkError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.QueryError);
	});
}
