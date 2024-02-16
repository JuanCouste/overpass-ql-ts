export enum HttpMethod {
	Get,
	Post,
}

export interface HttpRequest {
	readonly method?: HttpMethod;
	readonly body?: string;
}

export interface HttpResponse {
	readonly status: number;
	readonly contentType?: string;
	readonly response: string;
}

export interface RequestAdapter {
	request(url: URL, request?: HttpRequest): Promise<HttpResponse>;
}
