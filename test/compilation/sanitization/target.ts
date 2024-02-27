import { Symetric } from "?/utils";
import { OverpassCompileUtils } from "@/imp";
import { OverpassQueryTarget, ParamType } from "@/index";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

export function sanitizationTargetTests() {
	it("Should be fine when targets are fine", async () => {
		const utils = new OverpassCompileUtils();

		await ExpectCompileResolves(
			(value) => utils.target(value),
			[Symetric.Enum(ParamType.Target, OverpassQueryTarget.Node)],
		);
	});

	const max = Math.max(
		...(Object.values(OverpassQueryTarget).filter((value) => typeof value == "number") as number[]),
	);

	Array<number>(NaN, Infinity, null!, undefined!, -1, max + 1).forEach((number) => {
		it(`Should error when target is ${number}`, async () => {
			const utils = new OverpassCompileUtils();

			await ExpectCompileRejects((value) => utils.target(value), [Symetric.Enum(ParamType.Target, number)]);
		});
	});

	it("Should error when parameter is not a target", async () => {
		const utils = new OverpassCompileUtils();

		await ExpectCompileRejects(
			(value) => utils.target(value),
			[Symetric.Enum(ParamType.Target, "1" as unknown as OverpassQueryTarget)],
		);
	});
}
