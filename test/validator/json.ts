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
import { APP_JSON, JSON_OUTPUT, memoryExhaustionRemark, noAtticRemark, timeoutRemark, unknownRemark } from "../utils";

function validateJson(output: OverpassJsonOutput) {
	const validator = new OverpassQueryValidatorImp(null!);

	return validator.validate<OverpassJsonSettings<OverpassSettings>, OverpassOutputOptions>(
		"",
		{ status: 200, contentType: APP_JSON, response: JSON.stringify(output) },
		OverpassFormat.JSON,
	);
}

function validateJsonResult(elements: AnyOverpassElement[]): OverpassJsonOutput {
	return validateJson({ ...JSON_OUTPUT, elements });
}

async function validateJsonRemark(remark: string) {
	return validateJson({ ...JSON_OUTPUT, elements: [], remark });
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
