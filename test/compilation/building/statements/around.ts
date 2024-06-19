import { Symetric } from "?/utils";
import {
	OverpassAroundCenterStatement,
	OverpassAroundLineStatement,
	OverpassAroundSetStatement,
	OverpassStatementTargetImp,
} from "@/imp";
import { OverpassGeoPos, OverpassQueryTarget } from "@/index";
import { expect, it } from "@jest/globals";
import { CompileStatementsSymetric } from "./compile";

export function compileAroundStatementTests() {
	const staticTarget = new OverpassStatementTargetImp(OverpassQueryTarget.Node, []);

	it("Should compile around statement with radius", () => {
		const [raw, withParams] = CompileStatementsSymetric<[number]>(
			(radius) => new OverpassAroundCenterStatement(staticTarget, null!, radius, { lat: 1, lon: 2 }),
			[Symetric.Number(3)],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*around\s*:\s*3\s*,\s*1\s*,\s*2\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile around statement with radius and geopos", () => {
		const [raw, withParams] = CompileStatementsSymetric<[number, OverpassGeoPos]>(
			(radius, center) => new OverpassAroundCenterStatement(staticTarget, null!, radius, center),
			[Symetric.Number(7), Symetric.GeoPos({ lat: 8, lon: 9 })],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*around\s*:\s*7\s*,\s*8\s*,\s*9\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile around set statement with radius", () => {
		const [raw, withParams] = CompileStatementsSymetric<[number]>(
			(radius) => new OverpassAroundSetStatement(staticTarget, null!, radius),
			[Symetric.Number(1)],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*around\s*:\s*1\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile around set statement with radius and set", () => {
		const [raw, withParams] = CompileStatementsSymetric<[number, string]>(
			(radius, set) => new OverpassAroundSetStatement(staticTarget, null!, radius, set),
			[Symetric.Number(2), Symetric.String("set")],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*around\.set\s*:\s*2\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});

	it("Should compile around positions statement with radius", () => {
		const [raw, withParams] = CompileStatementsSymetric<[number, OverpassGeoPos]>(
			(radius, position) =>
				new OverpassAroundLineStatement(staticTarget, null!, radius, [{ lat: 2, lon: 3 }, position]),
			[Symetric.Number(1), Symetric.GeoPos({ lat: 4, lon: 5 })],
		);

		const rawResult = raw();

		expect(rawResult).toMatch(/\(\s*around\s*:\s*1\s*,\s*2\s*,\s*3\s*,\s*4\s*,\s*5\s*\)/);

		expect(withParams()).toEqual(rawResult);
	});
}
