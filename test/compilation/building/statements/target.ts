import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { CompileSymetric } from "?/compilation/symetry";
import { Symetric } from "?/utils";
import { OverpassCompileUtils, OverpassStatementTargetImp } from "@/imp";
import { OverpassQueryTarget, ParamType } from "@/index";
import { expect, it } from "@jest/globals";

export function compileTargetStatementTests() {
	it("Should compile target", async () => {
		const [raw, withParams] = CompileTargetSymetric(OverpassQueryTarget.Node);

		await expect(raw).resolves.toMatch(/\bnode\b/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile target with sets", async () => {
		const [raw, withParams] = CompileTargetSymetric(OverpassQueryTarget.Node, "set1", "set2");

		await expect(raw).resolves.toMatch(/\bnode.set1.set2\b/);

		await expect(withParams).resolves.toEqual(await raw);
	});
}

function CompileTargetSymetric(target: OverpassQueryTarget, ...sets: string[]) {
	const utils = new OverpassCompileUtils(NO_SANITIZER);

	return CompileSymetric<[OverpassQueryTarget, ...string[]]>(
		(target, ...sets) => new OverpassStatementTargetImp(target, sets).compile(utils),
		[Symetric.Enum(ParamType.Target, target), ...sets.map((set) => Symetric.String(set))],
	);
}
