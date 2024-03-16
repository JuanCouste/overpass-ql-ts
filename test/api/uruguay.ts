import { URUGUAY_ID } from "?/utils";
import { OverpassStatement } from "@/model";
import { OverpassJsonOutput, OverpassState } from "@/query";
import { expect } from "@jest/globals";

export function expectUruguay(output: OverpassJsonOutput | string) {
	expect(typeof output).toBe("object");

	const { elements } = output as OverpassJsonOutput;

	expect(elements.length).toBe(1);
	const [element] = elements;

	expect(element.id).toEqual(URUGUAY_ID);
	expect(element.type).toBe("relation");
}

export async function asyncExpectUruguay(promise: Promise<OverpassJsonOutput | string>): Promise<void> {
	await expect(promise).resolves.toBeInstanceOf(Object);

	const output = await promise;

	expectUruguay(output);
}

export function uruguayStatementBuilder(s: OverpassState): OverpassStatement[] {
	return [s.relation.byId(URUGUAY_ID)];
}
