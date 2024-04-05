import { OverpassApiObject } from "@/model";
import { FetchOverpassApi } from "./fetch";
import { HttpOverpassApi } from "./nodejs";
import { XMLOverpassApi } from "./xmlHttp";

export function DefaultOverpassApi(interpreterUrl?: string | URL, statusUrl?: string | URL): OverpassApiObject {
	if (globalThis.fetch != null) {
		return FetchOverpassApi(interpreterUrl, statusUrl);
	} else if (globalThis.XMLHttpRequest != null) {
		return XMLOverpassApi(interpreterUrl, statusUrl);
	} else {
		return HttpOverpassApi(interpreterUrl, statusUrl);
	}
}
