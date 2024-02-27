import { NodeHttpRequestAdapter } from "@/imp";
import { OverpassApiObject, OverpassApiObjectImp, RequestAdapter } from "@/index";

export function BuildApi(adapter: () => RequestAdapter = () => new NodeHttpRequestAdapter()): OverpassApiObject {
	return OverpassApiObjectImp.Build(adapter(), process.env.OVERPASS_QL_TS_URL);
}
