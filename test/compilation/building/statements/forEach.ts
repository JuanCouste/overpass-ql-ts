import { Symetric } from "?/utils";
import { OverpassForEachStatement } from "@/imp";
import { expect, it } from "@jest/globals";
import { CompileStatementsSymetric } from "./compile";

export function compileForEachStatementsTests() {
	it("Should compile foreach statement with set", () => {
		const [raw, withParams] = CompileStatementsSymetric<[string]>(
			(set) => new OverpassForEachStatement(() => [], set, undefined),
			[Symetric.String("set")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\s*foreach\.set\s*/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile foreach statement with item", () => {
		const [raw, withParams] = CompileStatementsSymetric<[string]>(
			(item) => new OverpassForEachStatement(() => [], null, item),
			[Symetric.String("item")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\s*foreach->\.item\s*/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile foreach statement with set and item", () => {
		const [raw, withParams] = CompileStatementsSymetric<[string, string]>(
			(set, item) => new OverpassForEachStatement(() => [], set, item),
			[Symetric.String("set"), Symetric.String("item")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\s*foreach\.set->\.item\s*/);

		expect(withParams()).toEqual(rawResult);
	});
}
