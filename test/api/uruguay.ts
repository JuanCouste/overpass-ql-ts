import { OverpassStatement } from "@/model";
import { OverpassJsonOutput, OverpassState } from "@/query";
import { expect } from "@jest/globals";
import { uruguayId } from "../testContext";

export function expectUruguay(output: OverpassJsonOutput | string) {
	expect(typeof output).toBe("object");

	const { elements } = output as OverpassJsonOutput;

	expect(elements.length).toBe(1);
	const [element] = elements;

	expect(element.id).toEqual(uruguayId);
	expect(element.type).toBe("relation");
}

export function uruguayStatementBuilder(s: OverpassState): OverpassStatement[] {
	return [s.relation.byId(uruguayId)];
}
