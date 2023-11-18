import { HttpResponse } from "@/imp/types/http";
import { OverpassApiOutput, OverpassFormat, OverpassOutputOptions, OverpassSettings } from "@/query";

export interface OverpassQueryValidator {
	validate<S extends OverpassSettings, O extends OverpassOutputOptions>(
		query: string,
		httpResponse: HttpResponse,
		format?: OverpassFormat,
	): OverpassApiOutput<S, O>;
}
