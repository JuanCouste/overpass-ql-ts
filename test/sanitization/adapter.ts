import { expect } from "@jest/globals";
import { OverpassJsonOutput, OverpassParameterError } from "../../src";

export async function ExpectResolves(result: Promise<OverpassJsonOutput>): Promise<void> {
	await expect(result).resolves.toHaveProperty("elements");
}

export async function ExpectParamteterError(result: Promise<OverpassJsonOutput>): Promise<void> {
	await expect(result).rejects.toThrow(OverpassParameterError);
}
