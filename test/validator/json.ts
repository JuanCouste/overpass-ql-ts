import {
	APP_JSON,
	JSON_OUTPUT,
	MEMORY_EXHAUSTION_REMARK,
	NO_ATTIC_REMARK,
	TIMEOUT_REMARK,
	UNKNOWN_REMARK,
} from "?/utils";
import { OverpassQueryValidatorImp } from "@/imp";
import {
	AnyOverpassElement,
	OverpassErrorType,
	OverpassFormat,
	OverpassJsonOutput,
	OverpassJsonSettings,
	OverpassOutputOptions,
	OverpassRemarkError,
	OverpassSettings,
} from "@/index";
import { expect, it } from "@jest/globals";

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
		const resultPromise = validateJsonRemark(TIMEOUT_REMARK);

		await expect(resultPromise).rejects.toThrow(OverpassRemarkError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.QueryTimeout);
	});

	it("Should handle memory exhaustion remark", async () => {
		const resultPromise = validateJsonRemark(MEMORY_EXHAUSTION_REMARK);

		await expect(resultPromise).rejects.toThrow(OverpassRemarkError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.MemoryExhaustionError);
	});

	it("Should handle no attic data remark", async () => {
		const resultPromise = validateJsonRemark(NO_ATTIC_REMARK);

		await expect(resultPromise).rejects.toThrow(OverpassRemarkError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.NoAtticData);
	});

	it("Should handle unknown remark", async () => {
		const resultPromise = validateJsonRemark(UNKNOWN_REMARK);

		await expect(resultPromise).rejects.toThrow(OverpassRemarkError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.QueryError);
	});
}
