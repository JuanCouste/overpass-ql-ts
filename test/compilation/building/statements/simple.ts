import { Symetric } from "?/utils";
import {
	OverpassAreaStatement,
	OverpassBBoxStatement,
	OverpassByIdStatement,
	OverpassInsidePolygonStatement,
	OverpassPivotStatement,
	OverpassStatementTargetImp,
} from "@/imp";
import { OverpassQueryTarget } from "@/index";
import { expect, it } from "@jest/globals";
import { CompileStatementsSymetric } from "./compile";

export function compileSimpleStatementsTests() {
	const staticTarget = new OverpassStatementTargetImp(OverpassQueryTarget.Node, []);

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
}
