import { FetchOverpassApi, HttpOverpassApi, XMLOverpassApi } from "@/imp/api/request";
import { OverpassApiObject } from "@/query";

export { OverpassApiObjectImp } from "./imp/api/api";
export * from "./imp/types";
export { FetchOverpassApi, HttpOverpassApi, XMLOverpassApi };

export * from "./model";
export * from "./query";

export function DefaultOverpassApi(interpreterUrl?: string | URL, statusUrl?: string | URL): OverpassApiObject {
	if (globalThis.fetch != null) {
		return FetchOverpassApi(interpreterUrl, statusUrl);
	} else if (globalThis.XMLHttpRequest != null) {
		return XMLOverpassApi(interpreterUrl, statusUrl);
	} else {
		return HttpOverpassApi(interpreterUrl, statusUrl);
	}
}
