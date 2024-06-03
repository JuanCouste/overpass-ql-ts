import { OverpassApiObjectOptions } from "@/imp/api/apiBuild";
import { OverpassApiObject } from "@/model";
import { FetchOverpassApi } from "./fetch";
import { HttpOverpassApi } from "./nodejs";
import { XMLOverpassApi } from "./xmlHttp";

export function DefaultOverpassApi(options: OverpassApiObjectOptions): OverpassApiObject;
export function DefaultOverpassApi(interpreterUrl?: string | URL, statusUrl?: string | URL): OverpassApiObject;
export function DefaultOverpassApi(
	optionsOrUrl?: OverpassApiObjectOptions | string | URL,
	statusUrl?: string | URL,
): OverpassApiObject {
	if (globalThis.fetch != null) {
		return FetchOverpassApi(optionsOrUrl as URL, statusUrl);
	} else if (globalThis.XMLHttpRequest != null) {
		return XMLOverpassApi(optionsOrUrl as URL, statusUrl);
	} else {
		return HttpOverpassApi(optionsOrUrl as URL, statusUrl);
	}
}
