import { BuildOverpassApi, NodeHttpRequestAdapter, OverpassApiObjectOptions } from "@/imp";
import { OverpassApiObject, RequestAdapter } from "@/index";

export const NOT_AN_API = new URL("http://not.an.api:12345/api/interpreter");

export function BuildApi(
	adapter: () => RequestAdapter = () => new NodeHttpRequestAdapter(),
	{ sanitization }: OverpassApiObjectOptions = {},
): OverpassApiObject {
	return BuildOverpassApi(adapter(), { interpreterUrl: process.env.OVERPASS_QL_TS_URL, sanitization });
}
