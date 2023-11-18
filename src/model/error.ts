export enum OverpassErrorType {
	QueryTimeout,
	NetworkError,
	TooManyRequests,
	DuplicateQuery,
	QueryError,
	ServerError,
	UnknownError,
	MemoryExhaustionError,
	NoAtticData,
}

interface ErrorOptions {
	cause?: unknown;
}

export class OverpassError extends Error {
	constructor(
		public readonly type: OverpassErrorType,
		message?: string,
		options?: ErrorOptions,
	) {
		const typeMessage = `OverpassError: ${OverpassErrorType[type]}`;
		super(message != null ? `[${typeMessage}] ${message}` : typeMessage, options);
	}
}

export class OverpassApiError extends OverpassError {
	constructor(
		type: OverpassErrorType,
		public readonly httpCode: number,
		public readonly url: URL,
		message?: string,
		options?: ErrorOptions,
	) {
		super(type, `${url.toString()}[${httpCode}] ${message}`, options);
	}
}

export class OverpassQueryError extends OverpassApiError {
	constructor(
		type: OverpassErrorType,
		httpCode: number,
		url: URL,
		public readonly query: string,
		message?: string,
		options?: ErrorOptions,
	) {
		super(type, httpCode, url, `${message}\n${query}`, options);
	}
}

export class OverpassRemarkError extends OverpassError {
	constructor(
		type: OverpassErrorType,
		public readonly query: string,
		public readonly remarks: string[],
		options?: ErrorOptions,
	) {
		super(type, [...remarks, query].join("\n"), options);
	}
}
