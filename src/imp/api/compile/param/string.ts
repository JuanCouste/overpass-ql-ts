import { OverpassExpression, OverpassParameterError, OverpassStringSanitizer } from "@/model";
import { BaseParamCompiledItem } from "./base";

export class StringParamCompiledItem extends BaseParamCompiledItem<string, string> {
	constructor(private readonly sanitizer: OverpassStringSanitizer, value: OverpassExpression<string>) {
		super(value);
	}

	protected validateParam(param: string): string {
		if (typeof param != "string") {
			throw new OverpassParameterError(`Unexpected string value (${param})`);
		}

		return param;
	}

	protected compilePram(param: string): string {
		return `"${this.sanitizer.sanitize(param)}"`;
	}
}
