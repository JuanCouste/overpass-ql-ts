import { OverpassApiObjectOptions } from "@/imp/api/build";
import { OverpassApiObject } from "@/model";
import { FetchOverpassApi } from "./fetch";
import { HttpOverpassApi } from "./nodejs";
import { XMLOverpassApi } from "./xmlHttp";

export function DefaultOverpassApi(options?: OverpassApiObjectOptions): OverpassApiObject;
/** @deprecated since 1.8.1, will be removed on 2.x.x, use {@link FetchOverpassApi} with {@link OverpassApiObjectOptions}*/
export function DefaultOverpassApi(interpreterUrl?: string | URL, statusUrl?: string | URL): OverpassApiObject;
export function DefaultOverpassApi(
	optionsOrUrl?: OverpassApiObjectOptions | string | URL,
	statusUrl?: string | URL,
): OverpassApiObject {
	if (globalThis.fetch != null) {
		return FetchOverpassApi(optionsOrUrl, statusUrl);
	} else if (globalThis.XMLHttpRequest != null) {
		return XMLOverpassApi(optionsOrUrl, statusUrl);
	} else {
		return HttpOverpassApi(optionsOrUrl, statusUrl);
	}
}
