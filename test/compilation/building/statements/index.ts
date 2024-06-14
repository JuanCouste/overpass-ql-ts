import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { CompileSymetric } from "?/compilation/symetry";
import { Symetric } from "?/utils";
import {
	OverpassAreaStatement,
	OverpassBBoxStatement,
	OverpassByIdStatement,
	OverpassCompileUtils,
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

	it("Should compile statements", async () => {
		const utils = new OverpassCompileUtils(NO_SANITIZER);

		const statements = [
			new OverpassRawStatement((u) => u.raw("Foo")),
			new OverpassRawStatement((u) => u.raw("Bar")),
		];

		const [raw, withParams] = CompileSymetric(
			() =>
				utils.join(
					statements.map((stm) => stm.compile(utils)),
					" ",
				),
			[],
		);

		await expect(raw).resolves.toBeDefined();

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile bbox statement", async () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(bbox) => new OverpassBBoxStatement(staticTarget, null!, bbox),
			[Symetric.BBox([1, 2, 3, 4])],
		);

		await expect(raw).resolves.toMatch(/\(\s*1\s*,\s*2\s*,\s*3\s*,\s*4\s*\)/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile byId statement", async () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(id) => new OverpassByIdStatement(staticTarget, null!, id),
			[Symetric.Number(1)],
		);

		await expect(raw).resolves.toMatch(/\(\s*1\s*\)/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile inside statement", async () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(...polygon) => new OverpassInsidePolygonStatement(staticTarget, null!, polygon),
			[Symetric.GeoPos({ lat: 1, lon: 2 })],
		);

		await expect(raw).resolves.toMatch(/\(\s*poly\s*:\s*"\s*1\s+2\s*"\s*\)/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile inside statement with many coords", async () => {
		const [raw, withParams] = CompileStatementsSymetric(
			(...polygon) => new OverpassInsidePolygonStatement(staticTarget, null!, polygon),
			[Symetric.GeoPos({ lat: 1, lon: 2 }), Symetric.GeoPos({ lat: 3, lon: 4 })],
		);

		await expect(raw).resolves.toMatch(/\(\s*poly\s*:\s*"\s*1\s+2\s+3\s+4\s*"\s*\)/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile area statement with set", async () => {
		const [raw, withParams] = CompileStatementsSymetric<[string]>(
			(set) => new OverpassAreaStatement(staticTarget, null!, set),
			[Symetric.String("set")],
		);

		await expect(raw).resolves.toMatch(/\(\s*area\.set\s*\)/);

		await expect(withParams).resolves.toEqual(await raw);
	});

	it("Should compile pivot statement with set", async () => {
		const [raw, withParams] = CompileStatementsSymetric<[string]>(
			(set) => new OverpassPivotStatement(staticTarget, null!, set),
			[Symetric.String("set")],
		);

		await expect(raw).resolves.toMatch(/\(\s*pivot\.set\s*\)/);

		await expect(withParams).resolves.toEqual(await raw);
	});
}
