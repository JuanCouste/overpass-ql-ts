import { OverpassParameterError } from "@/model";
import { BaseParamCompiledItem } from "./base";
import { isValidNumber } from "./utils";

export class NumberParamCompiledItem extends BaseParamCompiledItem<number, number> {
	protected validateParam(param: number): number {
		if (!isValidNumber(param)) {
			throw new OverpassParameterError(`Unexpected number value (${param})`);
		}

		return param;
	}

	protected compilePram(param: number): string {
		return param.toString();
	}
}
