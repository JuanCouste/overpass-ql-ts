import { Symetric } from "?/utils";
import { OverpassRecurseStatement } from "@/imp";
import { OverpassRecurseStmType, ParamType } from "@/index";
import { expect, it } from "@jest/globals";
import { CompileStatementsSymetric } from "./compile";

export function compileRootRecurseStatementTests() {
	it("Should compile recurse statement", () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(type) => new OverpassRecurseStatement(type),
			[Symetric.Enum(ParamType.RecurseStm, OverpassRecurseStmType.Up)],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\</);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile recurse statement with set", () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(input) => new OverpassRecurseStatement(OverpassRecurseStmType.Down, input),
			[Symetric.String("someSet")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\.someSet\b\s*\>/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile recurse statement with set and type", () => {
		const [raw, withParams] = CompileStatementsSymetric<[OverpassRecurseStmType, string]>(
			(type, input) => new OverpassRecurseStatement(type, input),
			[Symetric.Enum(ParamType.RecurseStm, OverpassRecurseStmType.UpRelations), Symetric.String("someSet")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\.someSet\b\s*\<\</);

		expect(withParams()).toEqual(rawResult);
	});
}
