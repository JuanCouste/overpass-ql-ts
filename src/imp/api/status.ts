import { HttpResponse, OverpassStatusValidator } from "@/imp/types";
import { OverpassApiError, OverpassErrorType, OverpassRunningQuery, OverpassStatus } from "@/model";

type TempOverpassStatus = { -readonly [K in keyof OverpassStatus]?: OverpassStatus[K] };

interface ParseState {
	runningQueries: boolean;
	queryIndexes: { [K in keyof OverpassRunningQuery]: number };
	queryPartsLen: number;
}

type PropHandler = (status: TempOverpassStatus, value: string) => void;

interface RegExpHandler {
	readonly regExp: RegExp;
	readonly handle: (status: TempOverpassStatus, line: string, state: ParseState, regExp: RegExp) => void;
}

export class OverpassStatusValidatorImp implements OverpassStatusValidator {
	constructor(private readonly statusUrl: URL, private readonly rejectOnUnexpected: boolean = false) {}

	private static ConnectedAs(status: TempOverpassStatus, value: string) {
		status.connectedAs = +value;
	}

	private static CurrentTime(status: TempOverpassStatus, value: string) {
		status.currentTime = new Date(value);
	}

	private static AnnouncedEndpoint(status: TempOverpassStatus, value: string) {
		if (value != "none") {
			status.announcedEndpoint = value;
		}
	}

	private static RateLimit(status: TempOverpassStatus, value: string) {
		status.ratelimit = +value;
	}

	private static CurrentlyRunningQueries(status: TempOverpassStatus, line: string, state: ParseState): void {
		const parts = line
			.slice(line.indexOf("(") + 1, -2)
			.split(",")
			.map((part) => part.trim());
		state.runningQueries = true;
		status.runningQueries = [];
		state.queryIndexes = {
			pid: parts.indexOf("pid"),
			spaceLimit: parts.indexOf("space limit"),
			timeLimit: parts.indexOf("time limit"),
			start: parts.indexOf("start time"),
		};
		state.queryPartsLen = parts.length;
	}

	private static SlotsAviable(status: TempOverpassStatus, line: string, state: ParseState, regExp: RegExp) {
		const [_, slots] = line.match(regExp)!;
		status.aviableSlots = +slots;
	}

	private static RunningQueryItem(status: TempOverpassStatus, line: string, state: ParseState) {
		const queryParts = line.split("\t");
		if (queryParts.length != state.queryPartsLen) {
			state.runningQueries = false;
		} else {
			const { pid, spaceLimit, timeLimit, start } = state.queryIndexes;
			status.runningQueries!.push({
				pid: +queryParts[pid],
				spaceLimit: +queryParts[spaceLimit],
				timeLimit: +queryParts[timeLimit],
				start: new Date(queryParts[start]),
			});
		}
	}

	private static GetPropHandlers(): Map<string, PropHandler> {
		return new Map([
			["Connected as", this.ConnectedAs],
			["Current time", this.CurrentTime],
			["Announced endpoint", this.AnnouncedEndpoint],
			["Rate limit", this.RateLimit],
		]);
	}

	private static GetRegExpHandlers(): RegExpHandler[] {
		return [
			{ regExp: /^Currently running queries/, handle: this.CurrentlyRunningQueries },
			{ regExp: /^(\d+) slots available now.$/, handle: this.SlotsAviable },
		];
	}

	private static PROP_HANDLERS: Map<string, PropHandler> = this.GetPropHandlers();
	private static REGEXP_HANDLERS: RegExpHandler[] = this.GetRegExpHandlers();

	private validateStatusResponse({ status, contentType, response }: HttpResponse) {
		if (status != 200 || !contentType?.startsWith("text/plain")) {
			throw new OverpassApiError(OverpassErrorType.UnknownError, status, this.statusUrl, undefined, {
				cause: response,
			});
		}
	}

	public validate(response: HttpResponse): OverpassStatus {
		this.validateStatusResponse(response);

		const status: TempOverpassStatus = {
			aviableSlots: Infinity,
		};

		const state: ParseState = {
			runningQueries: false,
			queryIndexes: undefined!,
			queryPartsLen: -1,
		};

		response.response.split("\n").forEach((line) => {
			if (line == "") return;

			if (state.runningQueries) {
				OverpassStatusValidatorImp.RunningQueryItem(status, line, state);
			}

			if (!state.runningQueries) {
				const colon = line.indexOf(":");
				const prop = line.substring(0, colon).trim();
				if (OverpassStatusValidatorImp.PROP_HANDLERS.has(prop)) {
					const value = line.substring(colon + 1).trim();
					OverpassStatusValidatorImp.PROP_HANDLERS.get(prop)!(status, value);
				} else {
					const handler = OverpassStatusValidatorImp.REGEXP_HANDLERS.find(({ regExp }) => regExp.test(line));
					if (handler != null) {
						handler.handle(status, line, state, handler.regExp);
					} else if (this.rejectOnUnexpected) {
						throw new Error(`Unexpected line from overpass status\n${line}`);
					}
				}
			}
		});

		return status as OverpassStatus;
	}
}
