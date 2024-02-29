import { OverpassApiObjectImp } from "@/imp/api/api";
import { HttpMethod, HttpRequest, HttpResponse, RequestAdapter } from "@/imp/types";
import { OverpassApiObject } from "@/model";
import { METHOD, NetworkError } from "./adapter";

export type HttpRequestMethod = typeof import("http").request;
export type HttpsRequestMethod = typeof import("https").request;
export type HttpRequestMethods = [HttpRequestMethod, HttpsRequestMethod];

export function HttpOverpassApi(interpreterUrl?: string | URL, statusUrl?: string | URL): OverpassApiObject {
	return OverpassApiObjectImp.Build(new NodeHttpRequestAdapter(), interpreterUrl, statusUrl);
}

export class NodeHttpRequestAdapter implements RequestAdapter {
	private static Methods?: HttpRequestMethods;
	private static LoadPromise?: Promise<void>;
	private static Loaded = false;

	private httpRequest!: HttpRequestMethod;
	private httpsRequest!: HttpsRequestMethod;
	private loaded = false;

	constructor(methods?: HttpRequestMethods) {
		if (methods != null) {
			[this.httpRequest, this.httpsRequest] = methods;
			this.loaded = true;
		} else if (!NodeHttpRequestAdapter.Loaded) {
			NodeHttpRequestAdapter.EnsureLoading();
		} else {
			[this.httpRequest, this.httpsRequest] = NodeHttpRequestAdapter.Methods!;
			this.loaded = true;
		}
	}

	private static EnsureLoading() {
		if (NodeHttpRequestAdapter.LoadPromise == null) {
			NodeHttpRequestAdapter.LoadPromise = NodeHttpRequestAdapter.Load();
		}
	}

	private static async Load(): Promise<void> {
		const [http, https] = await Promise.all([import("http"), import("https")]);
		this.Methods = [http.request, https.request];
		this.Loaded = true;
		delete this.LoadPromise;
	}

	public request(url: URL, request: HttpRequest = {}): Promise<HttpResponse> {
		if (this.loaded) {
			return this.doRequest(url, request);
		} else {
			return NodeHttpRequestAdapter.LoadPromise!.then(() => {
				[this.httpRequest, this.httpsRequest] = NodeHttpRequestAdapter.Methods!;
				this.loaded = true;
				return this.doRequest(url, request);
			});
		}
	}

	private doRequest(url: URL, { method, body }: HttpRequest): Promise<HttpResponse> {
		const requestMethod = url.protocol == "https:" ? this.httpsRequest : this.httpRequest;

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
