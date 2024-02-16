import { OverpassStatement } from "@/model";
import { OverpassJsonOutput, OverpassState } from "@/query";
import { expect } from "@jest/globals";
import { URUGUAY_ID } from "../utils";

export function expectUruguay(output: OverpassJsonOutput | string) {
	expect(typeof output).toBe("object");

	const { elements } = output as OverpassJsonOutput;

	expect(elements.length).toBe(1);
	const [element] = elements;

	expect(element.id).toEqual(URUGUAY_ID);
	expect(element.type).toBe("relation");
}

export function uruguayStatementBuilder(s: OverpassState): OverpassStatement[] {
	return [s.relation.byId(URUGUAY_ID)];
}
