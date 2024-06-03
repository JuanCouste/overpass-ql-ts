import { BuildOverpassApi, OverpassApiObjectOptions } from "@/imp/api/build";
import { HttpMethod, HttpRequest, HttpResponse, RequestAdapter } from "@/imp/types";
import { OverpassApiObject } from "@/model";
import { METHOD, NetworkError } from "./adapter";

export type FetchFunction = (input: RequestInfo | URL | string, init?: RequestInit) => Promise<Response>;

export function FetchOverpassApi(options: OverpassApiObjectOptions): OverpassApiObject;
/** @deprecated since 1.8.1, will be removed on 2.x.x, use {@link FetchOverpassApi} with {@link OverpassApiObjectOptions}*/
export function FetchOverpassApi(interpreterUrl?: string | URL, statusUrl?: string | URL): OverpassApiObject;
export function FetchOverpassApi(
	optionsOrUrl?: OverpassApiObjectOptions | string | URL,
	statusUrl?: string | URL,
): OverpassApiObject {
	return BuildOverpassApi(new FetchRequestAdapter(), optionsOrUrl as URL, statusUrl);
}

export class FetchRequestAdapter implements RequestAdapter {
	private readonly fetchFn: FetchFunction;

	constructor(fetchFn?: FetchFunction) {
		this.fetchFn = fetchFn ?? globalThis.fetch.bind(globalThis);
	}

	async request(url: URL, { method, body }: HttpRequest = {}): Promise<HttpResponse> {
		try {
			const response = await this.fetchFn(url, {
				method: METHOD[method ?? HttpMethod.Get],
				body: body,
			});

			const text = await response.text();

			return {
				status: response.status,
				response: text,
				contentType: response.headers.get("Content-type")!,
			};
		} catch (error) {
			throw NetworkError(error);
		}
	}
}
