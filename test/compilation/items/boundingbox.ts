import { Symetric } from "?/utils";
import { BBoxParamCompiledItem, ParentCompiledItem } from "@/imp";
import { CompiledItem, OverpassBoundingBox, OverpassExpression } from "@/index";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

type CardinalDirection = "south" | "west" | "north" | "east";

function BuildBBox(value: OverpassExpression<OverpassBoundingBox>): CompiledItem<string> {
	return new ParentCompiledItem(BBoxParamCompiledItem.BBox(value));
}

export function parametersBoundingBoxTests() {
	it("Should be fine when bboxs are fine", () => ExpectCompileResolves(BuildBBox, [Symetric.BBox([1, 2, 3, 4])]));

	it(`Should error when bboxs are nullish`, () => {
		ExpectCompileRejects(BuildBBox, [Symetric.BBox(null!)]);
		ExpectCompileRejects(BuildBBox, [Symetric.BBox(undefined!)]);
	});

	it("Should error when parameter is not a bbox", () =>
		ExpectCompileRejects(BuildBBox, [Symetric.BBox("name" as unknown as OverpassBoundingBox)]));

	const directions: CardinalDirection[] = ["south", "west", "north", "east"];

	it(`Should error when bbox directions are invalid`, () => {
		for (let i = 0; i < directions.length; i++) {
			for (const invalid of [NaN, Infinity, null!, undefined!]) {
				const bbox: OverpassBoundingBox = [1, 1, 1, 1];
				bbox[i] = invalid;
				ExpectCompileRejects(BuildBBox, [Symetric.BBox(bbox)]);
			}
		}
	});

	it(`Should error when bbox directions are out of range`, () => {
		const ranges: { [K in CardinalDirection]: number } = {
			south: 90,
			west: 180,
			north: 90,
			east: 180,
		};

		for (let i = 0; i < directions.length; i++) {
			for (const sign of [+1, -1]) {
				const outOfRange = ranges[directions[i]] + 1;
				const bbox: OverpassBoundingBox = [1, 1, 1, 1];
				bbox[i] = sign * outOfRange;
				ExpectCompileRejects(BuildBBox, [Symetric.BBox(bbox)]);
			}
		}
	});
}
