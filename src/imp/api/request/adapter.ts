import { enumObjectToArray } from "@/imp/api/enum";
import { HttpMethod } from "@/imp/types";
import { OverpassError, OverpassErrorType } from "@/model";

export const METHOD = enumObjectToArray({
	[HttpMethod.Get]: "GET",
	[HttpMethod.Post]: "POST",
});

export function NetworkError(error?: unknown) {
	return new OverpassError(OverpassErrorType.NetworkError, "Network error", { cause: error });
}
