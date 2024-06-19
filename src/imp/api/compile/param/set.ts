import { OverpassParameterError } from "@/model";
import { BaseParamCompiledItem } from "./base";

export class SetParamCompiledItem extends BaseParamCompiledItem<string, string> {
	protected validateParam(param: string): string {
		if (typeof param != "string") {
			throw new OverpassParameterError(`Unexpected set value (${param})`);
		}

		return param;
	}

	protected compilePram(param: string): string {
		return param;
	}
}
