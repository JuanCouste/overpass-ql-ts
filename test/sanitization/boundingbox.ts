import { OverpassBoundingBox, OverpassExpression, OverpassState, OverpassStatement, ParamType } from "../../src";
import { ItSymetrically, StaticAdapter } from "../utils";
import { ExpectParamteterError, ExpectResolves } from "./adapter";

function getInside(state: OverpassState, bbox: OverpassExpression<OverpassBoundingBox>): OverpassStatement {
	return state.node.bbox(bbox);
}

type CardinalDirection = "south" | "west" | "north" | "east";

export function sanitizationBoundingBoxTests() {
	ItSymetrically(
		"Should be fine when bbox is fine",
		StaticAdapter,
		getInside,
		[{ exp: [1, 1, 1, 1], type: ParamType.BoundingBox }],
		ExpectResolves,
	);

	ItSymetrically(
		"Should error when bbox is undefined",
		StaticAdapter,
		getInside,
		[{ exp: undefined! as OverpassBoundingBox, type: ParamType.BoundingBox }],
		ExpectParamteterError,
	);

	ItSymetrically(
		"Should error when bbox is null",
		StaticAdapter,
		getInside,
		[{ exp: null! as OverpassBoundingBox, type: ParamType.BoundingBox }],
		ExpectParamteterError,
	);

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

			ItSymetrically(
				`Should error when bbox ${direction} is ${number}`,
				StaticAdapter,
				getInside,
				[{ exp: bbox, type: ParamType.BoundingBox }],
				ExpectParamteterError,
			);
		});

		const outOfRange = ranges[direction] + 1;

		[+1, -1].forEach((sign) => {
			const bbox: OverpassBoundingBox = [1, 1, 1, 1];
			bbox[dirIndex] = sign * outOfRange;
			const signStr = sign >= 0 ? "+" : "-";

			ItSymetrically(
				`Should error when bbox ${direction} out of range [${signStr}]`,
				StaticAdapter,
				getInside,
				[{ exp: bbox, type: ParamType.BoundingBox }],
				ExpectParamteterError,
			);
		});
	});
}
