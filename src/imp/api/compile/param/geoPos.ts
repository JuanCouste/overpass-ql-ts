import { CompiledOverpassGeoPos, OverpassExpression, OverpassGeoPos, OverpassParameterError } from "@/model";
import { BaseParamCompiledItem } from "./base";
import { Axis, isOutOfRange, isValidNumber } from "./utils";

export class GeoPosParamCompiledItem extends BaseParamCompiledItem<OverpassGeoPos, number> {
	constructor(value: OverpassExpression<OverpassGeoPos>, private readonly coord: keyof OverpassGeoPos) {
		super(value);
	}

	public static GeoPos(value: OverpassExpression<OverpassGeoPos>): CompiledOverpassGeoPos {
		return {
			lat: new GeoPosParamCompiledItem(value, "lat"),
			lon: new GeoPosParamCompiledItem(value, "lon"),
		};
	}

	protected validateParam(param: OverpassGeoPos): number {
		if (param == null) {
			throw new OverpassParameterError(`Unexpected GeoPos value (${param})`);
		}

		const value = param[this.coord];

		if (!isValidNumber(value)) {
			throw new OverpassParameterError(`Unexpected GeoPos ${this.coord} value (${param})`);
		}

		if (isOutOfRange(value, this.coord == "lat" ? Axis.Lat : Axis.Lon)) {
			throw new OverpassParameterError(`GeoPos ${this.coord} out of range (${value})`);
		}

		return value;
	}

	protected compilePram(param: number): string {
		return param.toString();
	}
}
