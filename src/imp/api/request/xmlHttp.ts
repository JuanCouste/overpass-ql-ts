import { BuildOverpassApi, OverpassApiObjectOptions } from "@/imp/api/build";
import { HttpMethod, HttpRequest, HttpResponse, RequestAdapter } from "@/imp/types";
import { OverpassApiObject } from "@/model";
import { METHOD, NetworkError } from "./adapter";

export type XMLHttpRequestConstructor = new () => XMLHttpRequest;

export function XMLOverpassApi(options: OverpassApiObjectOptions): OverpassApiObject;
/** @deprecated since 1.8.1, will be removed on 2.x.x, use {@link XMLOverpassApi} with {@link OverpassApiObjectOptions}*/
export function XMLOverpassApi(interpreterUrl?: string | URL, statusUrl?: string | URL): OverpassApiObject;
export function XMLOverpassApi(
	optionsOrUrl?: OverpassApiObjectOptions | string | URL,
	statusUrl?: string | URL,
): OverpassApiObject {
	return BuildOverpassApi(new XMLHttpRequestAdapter(), optionsOrUrl as URL, statusUrl);
}

export class XMLHttpRequestAdapter implements RequestAdapter {
	private readonly XMLHttpRequest: XMLHttpRequestConstructor;

	constructor(XMLHttpRequest?: XMLHttpRequestConstructor) {
		this.XMLHttpRequest = XMLHttpRequest ?? globalThis.XMLHttpRequest;
	}

	request(url: URL, { method, body }: HttpRequest = {}): Promise<HttpResponse> {
		return new Promise<HttpResponse>((resolve, reject) => {
			const request = new this.XMLHttpRequest();
			request.open(METHOD[method ?? HttpMethod.Get], url, true);
			request.onreadystatechange = () => {
				if (request.readyState === 4) {
					if (request.status == 0) {
						reject(NetworkError());
					} else {
						resolve({
							status: request.status,
							contentType: request.getResponseHeader("content-type")!,
							response: request.responseText,
						});
					}
				}
			};

			request.onerror = (error) => reject(NetworkError(error));

			request.send(body);
		});
	}
}
