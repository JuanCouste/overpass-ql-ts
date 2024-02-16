import { OverpassApiObject, OverpassApiObjectImp, RequestAdapter } from "../../src";
import { NodeHttpRequestAdapter } from "../../src/imp/api/request/nodejs";

export function buildApi(adapter: () => RequestAdapter = () => new NodeHttpRequestAdapter()): OverpassApiObject {
	return OverpassApiObjectImp.Build(adapter(), process.env.OVERPASS_QL_TS_URL);
}
