import { OverpassStatus } from "@/query";
import { HttpResponse } from "./http";

export interface OverpassStatusValidator {
	validate(response: HttpResponse): OverpassStatus;
}
