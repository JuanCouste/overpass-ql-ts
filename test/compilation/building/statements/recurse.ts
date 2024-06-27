import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { Symetric } from "?/utils";
import { OverpassCompileUtils, OverpassRecurseFilterStatementImp, OverpassStatementTargetImp } from "@/imp";
import { OverpassParameterError, OverpassQueryTarget, ParamType } from "@/index";
import { expect, it } from "@jest/globals";
import { CompileStatementsSymetric } from "./compile";

export function compileRecurseStatementTests() {
	const staticTarget = new OverpassStatementTargetImp(OverpassQueryTarget.Node, []);
	const node = OverpassQueryTarget.Node;

	it("Should compile recurse statement with target", () => {
		const [raw, withParams] = CompileStatementsSymetric<[OverpassQueryTarget]>(
			(target) => new OverpassRecurseFilterStatementImp(staticTarget, null!, target, false, undefined, undefined),
			[Symetric.Enum(ParamType.Target, OverpassQueryTarget.Node)],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*n\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile recurse statement with set", () => {
		const [raw, withParams] = CompileStatementsSymetric<[string]>(
			(set) => new OverpassRecurseFilterStatementImp(staticTarget, null!, node, false, set, undefined),
			[Symetric.String("set")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*n\.set\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile recurse statement with role", () => {
		const [raw, withParams] = CompileStatementsSymetric<[string]>(
			(role) => new OverpassRecurseFilterStatementImp(staticTarget, null!, node, false, undefined, role),
			[Symetric.String("role")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*n\s*:\s*\"role\"\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile recurse statement with set & role", () => {
		const [raw, withParams] = CompileStatementsSymetric<[string, string]>(
			(set, role) => new OverpassRecurseFilterStatementImp(staticTarget, null!, node, false, set, role),
			[Symetric.String("set"), Symetric.String("role")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*n\.set\s*:\s*\"role\"\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile backwards recurse statement", () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);
		const recurse = new OverpassRecurseFilterStatementImp(staticTarget, null!, node, true, undefined, undefined);

		expect(recurse.compile(utils).simplify()).toMatch(/\(\s*bn\s*\)/);
	});

	it("Should compile recurse statement with chained properties", () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);
		const recurse = new OverpassRecurseFilterStatementImp(staticTarget, null!, node, false, undefined, undefined);

		expect(recurse.inSet("set").withRole("role").compile(utils).simplify()).toMatch(
			/\(\s*n\.set\s*:\s*\"role\"\s*\)/,
		);
	});

	it("Should compile recurse statement with empty role", () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);
		const recurse = new OverpassRecurseFilterStatementImp(staticTarget, null!, node, false, undefined, undefined);

		expect(recurse.withoutRole().compile(utils).simplify()).toMatch(/\(\s*n\s*:\s*\"\"\s*\)/);
	});

	it("Should compile backwards recurse statement", () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		const recurse = new OverpassRecurseFilterStatementImp(
			staticTarget,
			null!,
			OverpassQueryTarget.Area,
			false,
			undefined,
			undefined,
		);

		expect(() => recurse.compile(utils)).toThrowError(OverpassParameterError);
	});
}
