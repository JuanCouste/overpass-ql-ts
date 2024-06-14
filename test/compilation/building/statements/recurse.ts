import { Symetric } from "?/utils";
import { OverpassRecurseStatement } from "@/imp";
import { OverpassRecurseStmType, ParamType } from "@/index";
import { expect, it } from "@jest/globals";
import { CompileStatementsSymetric } from "./compile";

export function compileRecurseStatementTests() {
	it("Should compile recurse statement", async () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(type) => new OverpassRecurseStatement(type),
			[Symetric.Enum(ParamType.RecurseStm, OverpassRecurseStmType.Up)],
		);

		await expect(raw).resolves.toMatch(/\</);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile recurse statement with set", async () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(input) => new OverpassRecurseStatement(OverpassRecurseStmType.Down, input),
			[Symetric.String("someSet")],
		);

		await expect(raw).resolves.toMatch(/\.someSet\b\s*\>/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile recurse statement with set and type", async () => {
		const [raw, withParams] = CompileStatementsSymetric<[OverpassRecurseStmType, string]>(
			(type, input) => new OverpassRecurseStatement(type, input),
			[Symetric.Enum(ParamType.RecurseStm, OverpassRecurseStmType.UpRelations), Symetric.String("someSet")],
		);

		await expect(raw).resolves.toMatch(/\.someSet\b\s*\<\</);

		await expect(withParams).resolves.toEqual(await raw);
	});
}
