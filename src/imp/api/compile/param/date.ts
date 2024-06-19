import { OverpassParameterError } from "@/model";
import { BaseParamCompiledItem } from "./base";

export class DateParamCompiledItem extends BaseParamCompiledItem<Date, Date> {
	protected validateParam(param: Date): Date {
		if (!(param instanceof Date)) {
			throw new OverpassParameterError(`Unexpected Date value (${param})`);
		}

		if (isNaN(param.getTime())) {
			throw new OverpassParameterError(`Invalid Date (${param.getTime()})`);
		}

		return param;
	}

	protected compilePram(param: Date): string {
		return param.toISOString();
	}
}
