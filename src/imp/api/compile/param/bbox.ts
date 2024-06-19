import {
	CompiledItem,
	CompiledOverpassBoundingBox,
	OverpassBoundingBox,
	OverpassExpression,
	OverpassParameterError,
} from "@/model";
import { BaseParamCompiledItem } from "./base";
import { Axis, isOutOfRange, isValidNumber } from "./utils";

const BBOX_SEED: OverpassBoundingBox = [0, 0, 0, 0];

const DIRECTIONS = ["south", "west", "north", "east"];

export class BBoxParamCompiledItem extends BaseParamCompiledItem<OverpassBoundingBox, number> {
	constructor(value: OverpassExpression<OverpassBoundingBox>, private readonly dirIndex: number) {
		super(value);
	}

	public static BBox(value: OverpassExpression<OverpassBoundingBox>): CompiledOverpassBoundingBox {
		const bbox = BBOX_SEED.map<CompiledItem<number>>((_, dirIndex) => new BBoxParamCompiledItem(value, dirIndex));

		return bbox as CompiledOverpassBoundingBox;
	}

	protected validateParam(param: OverpassBoundingBox): number {
		if (param == null) {
			throw new OverpassParameterError(`Unexpected BoundingBox value (${param})`);
		}

		const value = param[this.dirIndex];

		if (!isValidNumber(value)) {
			throw new OverpassParameterError(`Unexpected BoundingBox ${DIRECTIONS[this.dirIndex]} value (${param})`);
		}

		if (isOutOfRange(value, this.dirIndex % 2 == 0 ? Axis.Lat : Axis.Lon)) {
			throw new OverpassParameterError(`BoundingBox ${DIRECTIONS[this.dirIndex]} out of range (${value})`);
		}

		return value;
	}

	protected compilePram(param: number): string {
		return param.toString();
	}
}
