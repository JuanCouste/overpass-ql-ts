import { OverpassParameterError } from "@/model";
import { BaseParamCompiledItem } from "./base";

export class RegExpParamCompiledItem extends BaseParamCompiledItem<RegExp, RegExp> {
	protected validateParam(param: RegExp): RegExp {
		if (!(param instanceof RegExp)) {
			throw new OverpassParameterError(`Unexpected RegExp value (${param})`);
		}

		return param;
	}

	protected compilePram(param: RegExp): string {
		return `"${param.source}"`;
	}
}
