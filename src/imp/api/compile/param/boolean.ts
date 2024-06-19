import { OverpassParameterError } from "@/model";
import { BaseParamCompiledItem } from "./base";

export class BooleanParamCompiledItem extends BaseParamCompiledItem<boolean, boolean> {
	protected validateParam(param: boolean): boolean {
		if (param == null) {
			throw new OverpassParameterError(`Unexpected boolean value (${param})`);
		}

		if (typeof param != "boolean") {
			throw new OverpassParameterError(`Unexpected boolean value (${param})`);
		}

		return param;
	}

	protected compilePram(param: boolean): string {
		return param ? "1" : "0";
	}
}
