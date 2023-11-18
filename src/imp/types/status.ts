import { HttpResponse } from "@/imp/types/http";
import { OverpassStatus } from "@/query";

export interface OverpassStatusValidator {
	validate(response: HttpResponse): OverpassStatus;
}
