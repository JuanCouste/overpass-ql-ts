import { OverpassApiObjectImp } from "@/imp/api/api";
import { HttpMethod, HttpRequest, HttpResponse, RequestAdapter } from "@/imp/types";
import { OverpassApiObject } from "@/query";
import { METHOD, NetworkError } from "./adapter";

export function HttpOverpassApi(interpreterUrl?: string | URL, statusUrl?: string | URL): OverpassApiObject {
	return OverpassApiObjectImp.Build(new NodeHttpRequestAdapter(), interpreterUrl, statusUrl);
}

export class NodeHttpRequestAdapter implements RequestAdapter {
	private static httpRequest: typeof import("http").request;
	private static httpsRequest: typeof import("https").request;
	private static loadPromise?: Promise<void>;
	private static loaded = false;

	constructor() {
		if (!NodeHttpRequestAdapter.loaded) {
			this.ensureLoading();
		}
	}

	private static async Load(): Promise<void> {
		const [http, https] = await Promise.all([import("http"), import("https")]);
		this.httpRequest = http.request;
		this.httpsRequest = https.request;
		this.loaded = true;
		delete this.loadPromise;
	}

	private ensureLoading() {
		if (NodeHttpRequestAdapter.loadPromise == null) {
			NodeHttpRequestAdapter.loadPromise = NodeHttpRequestAdapter.Load();
		}
	}

	public request(url: URL, request: HttpRequest = {}): Promise<HttpResponse> {
		if (NodeHttpRequestAdapter.loaded) {
			return this.doRequest(url, request);
		} else {
			this.ensureLoading();

			return NodeHttpRequestAdapter.loadPromise!.then(() => this.doRequest(url, request));
		}
	}

	private doRequest(url: URL, { method, body }: HttpRequest): Promise<HttpResponse> {
		const requestMethod =
			url.protocol == "https:" ? NodeHttpRequestAdapter.httpsRequest : NodeHttpRequestAdapter.httpRequest;

		return new Promise<HttpResponse>((resolve, reject) => {
			const request = requestMethod(url, { method: METHOD[method ?? HttpMethod.Get] });

			request.on("response", (response) => {
				let responseBody = "";
				response.on("data", (chunk) => (responseBody += chunk));
				response.on("end", () => {
					if (response.statusCode == null || response.statusCode == 0) {
						reject(NetworkError(responseBody));
					} else {
						resolve({
							contentType: response.headers["content-type"]!,
							response: responseBody,
							status: response.statusCode,
						});
					}
				});
			});

			request.on("error", (error) => reject(NetworkError(error)));

			if (body != null) {
				request.write(body);
			}

			request.end();
		});
	}
}
