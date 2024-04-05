import { OverpassApiObjectImp } from "@/imp/api/api";
import { HttpMethod, HttpRequest, HttpResponse, RequestAdapter } from "@/imp/types";
import { OverpassApiObject } from "@/model";
import { METHOD, NetworkError } from "./adapter";

export type XMLHttpRequestConstructor = new () => XMLHttpRequest;

export function XMLOverpassApi(interpreterUrl?: string | URL, statusUrl?: string | URL): OverpassApiObject {
	return OverpassApiObjectImp.Build(new XMLHttpRequestAdapter(), interpreterUrl, statusUrl);
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
