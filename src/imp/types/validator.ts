import { OverpassApiOutput, OverpassFormat, OverpassOutputOptions, OverpassSettings } from "@/model";
import { HttpResponse } from "./http";

export interface OverpassQueryValidator {
	validate<S extends OverpassSettings, O extends OverpassOutputOptions>(
		query: string,
		httpResponse: HttpResponse,
		format?: OverpassFormat,
	): OverpassApiOutput<S, O>;
}
