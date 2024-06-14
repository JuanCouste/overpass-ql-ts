import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { CompileSymetric } from "?/compilation/symetry";
import { Symetric } from "?/utils";
import {
	OverpassAreaStatement,
	OverpassBBoxStatement,
	OverpassByIdStatement,
	OverpassCompileUtils,
	OverpassForEachStatement,
	OverpassInsidePolygonStatement,
	OverpassPivotStatement,
	OverpassRawStatement,
	OverpassStatementTargetImp,
} from "@/imp";
import { OverpassQueryTarget } from "@/index";
import { describe, expect, it } from "@jest/globals";
import { compileAroundStatementTests } from "./around";
import { CompileStatementsSymetric } from "./compile";
import { compileOutStatementTests } from "./options";
import { compileRecurseStatementTests } from "./recurse";
import { compileSettingsStatementsTests } from "./settings";
import { compileTargetStatementTests } from "./target";

export function compileStatementsTests() {
	describe("Recurse", compileRecurseStatementTests);
	describe("Target", compileTargetStatementTests);
	describe("Around", compileAroundStatementTests);
	describe("Out", compileOutStatementTests);
	describe("Settings", compileSettingsStatementsTests);

	const staticTarget = new OverpassStatementTargetImp(OverpassQueryTarget.Node, []);

	it("Should compile statements", () => {
		const u = new OverpassCompileUtils(NO_SANITIZER);

		const stms = [new OverpassRawStatement((u) => u.raw("Foo")), new OverpassRawStatement((u) => u.raw("Bar"))];

		const [raw, withParams] = CompileSymetric(
			() =>
				u.join(
					stms.map((stm) => stm.compile(u)),
					" ",
				),
			[],
		);

		const rawResult = raw();

		expect(rawResult).toBeDefined();

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile bbox statement", () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(bbox) => new OverpassBBoxStatement(staticTarget, null!, bbox),
			[Symetric.BBox([1, 2, 3, 4])],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*1\s*,\s*2\s*,\s*3\s*,\s*4\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile byId statement", () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(id) => new OverpassByIdStatement(staticTarget, null!, id),
			[Symetric.Number(1)],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*1\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile inside statement", () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(...polygon) => new OverpassInsidePolygonStatement(staticTarget, null!, polygon),
			[Symetric.GeoPos({ lat: 1, lon: 2 })],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*poly\s*:\s*"\s*1\s+2\s*"\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile inside statement with many coords", () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(...polygon) => new OverpassInsidePolygonStatement(staticTarget, null!, polygon),
			[Symetric.GeoPos({ lat: 1, lon: 2 }), Symetric.GeoPos({ lat: 3, lon: 4 })],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*poly\s*:\s*"\s*1\s+2\s+3\s+4\s*"\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile area statement with set", () => {
		const [raw, withParams] = CompileStatementsSymetric<[string]>(
			(set) => new OverpassAreaStatement(staticTarget, null!, set),
			[Symetric.String("set")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*area\.set\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile pivot statement with set", () => {
		const [raw, withParams] = CompileStatementsSymetric<[string]>(
			(set) => new OverpassPivotStatement(staticTarget, null!, set),
			[Symetric.String("set")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*pivot\.set\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});

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
