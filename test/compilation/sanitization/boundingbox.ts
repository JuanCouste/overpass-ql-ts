import { NO_SANITIZER } from "?/compilation/nosanitizer";
import { Symetric } from "?/utils";
import { OverpassCompileUtils } from "@/imp";
import { OverpassBoundingBox, OverpassExpression } from "@/index";
import { it } from "@jest/globals";
import { ExpectCompileRejects, ExpectCompileResolves } from "./utils";

type CardinalDirection = "south" | "west" | "north" | "east";

function BuildBBox(value: OverpassExpression<OverpassBoundingBox>) {
	const u = new OverpassCompileUtils(NO_SANITIZER);

	return u.join(u.bbox(value), ",");
}

export function sanitizationBoundingBoxTests() {
	it("Should be fine when bboxs are fine", async () => {
		await ExpectCompileResolves(BuildBBox, [Symetric.BBox([1, 2, 3, 4])]);
	});

	it("Should error when bboxs are undefined", async () => {
		await ExpectCompileRejects(BuildBBox, [Symetric.BBox(undefined!)]);
	});

	it("Should error when bboxs are null", async () => {
		await ExpectCompileRejects(BuildBBox, [Symetric.BBox(null!)]);
	});

	it("Should error when parameter is not a bbox", async () => {
		await ExpectCompileRejects(BuildBBox, [Symetric.BBox("name" as unknown as OverpassBoundingBox)]);
	});

	const ranges: { [K in CardinalDirection]: number } = {
		south: 90,
		west: 180,
		north: 90,
		east: 180,
	};

	const directions: CardinalDirection[] = ["south", "west", "north", "east"];

	directions.forEach((direction, dirIndex) => {
		Array<number>(NaN, Infinity, null!, undefined!).forEach((number) => {
			const bbox: OverpassBoundingBox = [1, 1, 1, 1];
			bbox[dirIndex] = number;

			it(`Should error when bbox ${direction} is ${number}`, async () => {
				const u = new OverpassCompileUtils(NO_SANITIZER);

				await ExpectCompileRejects((value) => u.join(u.bbox(value), ","), [Symetric.BBox(bbox)]);
			});
		});

		const outOfRange = ranges[direction] + 1;

		[+1, -1].forEach((sign) => {
			const bbox: OverpassBoundingBox = [1, 1, 1, 1];
			bbox[dirIndex] = sign * outOfRange;
			const signStr = sign >= 0 ? "+" : "-";

			it(`Should error when bbox ${direction} out of range [${signStr}]`, async () => {
				const u = new OverpassCompileUtils(NO_SANITIZER);

				await ExpectCompileRejects((value) => u.join(u.bbox(value), ","), [Symetric.BBox(bbox)]);
			});
		});
	});
}
