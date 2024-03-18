import { CompileSymetric } from "?/compilation/symetry";
import { Symetric, SymetricArgsExpression, SymetricArgumentsObject } from "?/utils";
import {
	OverapssRecurseStatement,
	OverpassBBoxStatement,
	OverpassByIdStatement,
	OverpassCompileUtils,
	OverpassInsidePolygonStatement,
	OverpassQueryBuilderImp,
	OverpassRawStatement,
	OverpassStatementTargetImp,
} from "@/imp";
import { AnyParamValue, OverpassQueryTarget, OverpassRecurseStmType, OverpassStatement, ParamType } from "@/index";
import { expect, it } from "@jest/globals";

export function compileStatementsTests() {
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

	const staticTarget = new OverpassStatementTargetImp(OverpassQueryTarget.Node, []);

	it("Should compile statements", async () => {
		const utils = new OverpassCompileUtils();
		const builder = new OverpassQueryBuilderImp(utils);

		const [raw, withParams] = CompileSymetric(
			() =>
				builder.buildStatements([
					new OverpassRawStatement((u) => u.raw("Foo")),
					new OverpassRawStatement((u) => u.raw("Bar")),
				]),
			[],
		);

		await expect(raw).resolves.toBeDefined();

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile bbox statement", async () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(bbox) => new OverpassBBoxStatement(staticTarget, bbox),
			[Symetric.BBox([1, 2, 3, 4])],
		);

		await expect(raw).resolves.toMatch(/\(\s*1\s*,\s*2\s*,\s*3\s*,\s*4\s*\)/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile byId statement", async () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(id) => new OverpassByIdStatement(staticTarget, id),
			[Symetric.Number(1)],
		);

		await expect(raw).resolves.toMatch(/\(\s*1\s*\)/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile inside statement", async () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(...polygon) => new OverpassInsidePolygonStatement(staticTarget, polygon),
			[Symetric.GeoPos({ lat: 1, lon: 2 })],
		);

		await expect(raw).resolves.toMatch(/\(\s*poly\s*:\s*"\s*1\s+2\s*"\s*\)/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile inside statement with many coords", async () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(...polygon) => new OverpassInsidePolygonStatement(staticTarget, polygon),
			[Symetric.GeoPos({ lat: 1, lon: 2 }), Symetric.GeoPos({ lat: 3, lon: 4 })],
		);

		await expect(raw).resolves.toMatch(/\(\s*poly\s*:\s*"\s*1\s+2\s+3\s+4\s*"\s*\)/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile recurse statement", async () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(type) => new OverapssRecurseStatement(type),
			[Symetric.Enum(ParamType.RecurseStm, OverpassRecurseStmType.Up)],
		);

		await expect(raw).resolves.toMatch(/\</);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile recurse statement with set", async () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(input) => new OverapssRecurseStatement(OverpassRecurseStmType.Down, input),
			[Symetric.String("someSet")],
		);

		await expect(raw).resolves.toMatch(/\.someSet\b\s*\>/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile recurse statement with set and type", async () => {
		const [raw, withParams] = CompileStatementsSymetric<[OverpassRecurseStmType, string]>(
			(type, input) => new OverapssRecurseStatement(type, input),
			[Symetric.Enum(ParamType.RecurseStm, OverpassRecurseStmType.UpRelations), Symetric.String("someSet")],
		);

		await expect(raw).resolves.toMatch(/\.someSet\b\s*\<\</);

		await expect(withParams).resolves.toEqual(await raw);
	});
}

function CompileStatementsSymetric<Args extends AnyParamValue[]>(
	buildStatement: (...args: SymetricArgsExpression<Args>) => OverpassStatement,
	args: SymetricArgumentsObject<Args>,
) {
	const utils = new OverpassCompileUtils();

	return CompileSymetric<Args>((...args) => buildStatement(...args).compile(utils), args);
}

function CompileTargetSymetric(target: OverpassQueryTarget, ...sets: string[]) {
	const utils = new OverpassCompileUtils();

	return CompileSymetric<[OverpassQueryTarget, ...string[]]>(
		(target, ...sets) => new OverpassStatementTargetImp(target, sets).compile(utils),
		[Symetric.Enum(ParamType.Target, target), ...sets.map((set) => Symetric.String(set))],
	);
}
