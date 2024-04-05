import { HttpResponse, OverpassQueryValidator } from "@/imp/types";
import {
	OverpassApiOutput,
	OverpassErrorType,
	OverpassFormat,
	OverpassJsonOutput,
	OverpassOutputOptions,
	OverpassQueryError,
	OverpassRemarkError,
	OverpassSettings,
} from "@/model";

interface RegExpRemarkMather {
	readonly regExp: RegExp;
	readonly type: OverpassErrorType;
}

const REMARK_MATCHERS: RegExpRemarkMather[] = [
	{
		regExp: /runtime error: open64: \d+ Success \/osm3s_osm_base Dispatcher_Client::request_read_and_idx::duplicate_query/,
		type: OverpassErrorType.DuplicateQuery,
	},
	{
		regExp: /runtime error: Query timed out in "[\w-]+" at line \d+ after \d+ seconds\./,
		type: OverpassErrorType.QueryTimeout,
	},
	{
		regExp: /runtime error: Query ran out of memory in "[\w-]+" at line \d+. It would need at least [\d.,]+ MB of RAM to continue\./,
		type: OverpassErrorType.MemoryExhaustionError,
	},
	{
		regExp: /runtime error: Tried to use museum file but no museum files available on this instance\./,
		type: OverpassErrorType.NoAtticData,
	},
	{
		regExp: /runtime error: open64: \d+ No such file or directory \/db\/db\/relations_attic.map Random_File:\d+/,
		type: OverpassErrorType.NoAtticData,
	},
];

export class OverpassQueryValidatorImp implements OverpassQueryValidator {
	constructor(private readonly interpreterUrl: URL) {}

	private parseErrorsFromHtml(htmlResponse: string): string[] {
		return htmlResponse
			.split("</strong>")
			.slice(1)
			.map((errorStr) => {
				const error = errorStr.substring(0, errorStr.indexOf("</p>"));
				const lineError = error.split("\n").join(" ").split("<br>").join(" ").trim();
				return lineError.startsWith(":") ? lineError.slice(1).trim() : lineError;
			});
	}

	private validateHttpResponse(
		httpCode: number,
		overpassQuery: string,
		response: string,
		responseType?: string,
	): void {
		if (httpCode != 200 || responseType == null) {
			let message: string;
			if (responseType?.startsWith("text/html")) {
				message = this.parseErrorsFromHtml(response).join("\n");
			} else {
				message = response;
			}
			const reqParams: [number, URL, string] = [httpCode, this.interpreterUrl, overpassQuery];
			switch (httpCode) {
				case 400:
					throw new OverpassQueryError(OverpassErrorType.QueryError, ...reqParams, message);
				case 429:
					throw new OverpassQueryError(OverpassErrorType.TooManyRequests, ...reqParams);
				default:
					if (httpCode >= 500) {
						throw new OverpassQueryError(OverpassErrorType.ServerError, ...reqParams, message);
					} else {
						throw new OverpassQueryError(OverpassErrorType.UnknownError, ...reqParams, message);
					}
			}
		} else if (responseType.startsWith("text/html")) {
			const errors = this.parseErrorsFromHtml(response);

			const type = errors.reduce<OverpassErrorType | null>(
				(acc, error) => REMARK_MATCHERS.find(({ regExp }) => regExp.test(error))?.type ?? acc,
				null,
			);

			throw new OverpassRemarkError(type ?? OverpassErrorType.QueryError, overpassQuery, errors);
		}
	}

	private throwRemark(query: string, remark: string, remarks: string[]) {
		REMARK_MATCHERS.forEach(({ regExp, type }) => {
			if (regExp.test(remark)) {
				throw new OverpassRemarkError(type, query, remarks);
			}
		});

		throw new OverpassRemarkError(OverpassErrorType.QueryError, query, remarks);
	}

	private validateJson(query: string, { remark }: OverpassJsonOutput) {
		if (remark != null) {
			this.throwRemark(query, remark, [remark]);
		}
	}

	private parseErrorsFromXML(xmlResponse: string): string[] {
		return xmlResponse
			.split("<remark>")
			.slice(1)
			.map((errorStr) => errorStr.substring(0, errorStr.indexOf("</remark>")).trim());
	}

	private validateXML(query: string, xml: string) {
		const remarks = this.parseErrorsFromXML(xml);
		if (remarks.length > 0) {
			this.throwRemark(query, remarks[0], remarks);
		}
	}

	public validate<S extends OverpassSettings, O extends OverpassOutputOptions>(
		query: string,
		{ status, response, contentType }: HttpResponse,
		format: OverpassFormat,
	): OverpassApiOutput<S, O> {
		this.validateHttpResponse(status, query, response, contentType);

		switch (format) {
			case OverpassFormat.JSON: {
				const parsed = JSON.parse(response) as OverpassJsonOutput;

				this.validateJson(query, parsed);

				return parsed as OverpassApiOutput<S, O>;
			}
			case OverpassFormat.XML: {
				this.validateXML(query, response);

				return response as OverpassApiOutput<S, O>;
			}
			default:
				return response as OverpassApiOutput<S, O>;
		}
	}
}
