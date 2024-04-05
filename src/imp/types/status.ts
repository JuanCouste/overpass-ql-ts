import { OverpassStatus } from "@/model";
import { HttpResponse } from "./http";

export interface OverpassStatusValidator {
	validate(response: HttpResponse): OverpassStatus;
}
