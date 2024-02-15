import "./setup/checkConnection";
//
import { OverpassStatusValidatorImp } from "@/imp/api/status";
import { describe, expect, it } from "@jest/globals";
import { HttpResponse, OverpassApiError, OverpassErrorType, OverpassStatus } from "../src";
import { APP_OSM_XML, TEXT_PLAIN } from "./utils";

const noQueriesStr = `Connected as: 2886860801
Current time: 2023-12-23T06:14:08Z
Announced endpoint: none
Rate limit: 0
Currently running queries (pid, space limit, time limit, start time):`;

const noQueriesObj: OverpassStatus = {
	connectedAs: 2886860801,
	currentTime: new Date("2023-12-23T06:14:08Z"),
	ratelimit: 0,
	runningQueries: [],
	aviableSlots: Infinity,
};

function validateResult(result: HttpResponse): OverpassStatus {
	return new OverpassStatusValidatorImp(new URL(`http://localhost`)).validate(result);
}

function validateStatusStr(statusStr: string): OverpassStatus {
	return validateResult({
		status: 200,
		contentType: TEXT_PLAIN,
		response: statusStr,
	});
}

async function erroringValidateStatusStr(result: HttpResponse): Promise<OverpassStatus> {
	return validateResult(result);
}

describe("Status", () => {
	it("Should fetch status without queries", async () => {
		const status = validateStatusStr(noQueriesStr);

		expect(status).toEqual(noQueriesObj);
	});

	it("Should fetch status with queries", async () => {
		const withQueriesStr = `${noQueriesStr}
20259	536870912	180	2023-12-23T06:40:42Z
20255	536870912	180	2023-12-23T06:40:40Z
20260	536870912	180	2023-12-23T06:40:42Z`;

		const withQueriesObj: OverpassStatus = {
			...noQueriesObj,
			runningQueries: [
				{ pid: 20259, spaceLimit: 536870912, timeLimit: 180, start: new Date("2023-12-23T06:40:42Z") },
				{ pid: 20255, spaceLimit: 536870912, timeLimit: 180, start: new Date("2023-12-23T06:40:40Z") },
				{ pid: 20260, spaceLimit: 536870912, timeLimit: 180, start: new Date("2023-12-23T06:40:42Z") },
			],
		};

		const status = validateStatusStr(withQueriesStr);

		expect(status).toEqual(withQueriesObj);
	});

	it("Should fetch status with endpoint", async () => {
		const withEndpointStr = `Connected as: 2886860801
Current time: 2023-12-23T06:14:08Z
Announced endpoint: z.overpass-api.de/api/
Rate limit: 0
Currently running queries (pid, space limit, time limit, start time):`;

		const withEndpointObj: OverpassStatus = {
			connectedAs: 2886860801,
			currentTime: new Date("2023-12-23T06:14:08Z"),
			announcedEndpoint: "z.overpass-api.de/api/",
			ratelimit: 0,
			runningQueries: [],
			aviableSlots: Infinity,
		};

		const status = validateStatusStr(withEndpointStr);

		expect(status).toEqual(withEndpointObj);
	});

	it("Should fetch status with slots", async () => {
		const withSlotsStr = `Connected as: 2886860801
Current time: 2023-12-23T06:14:08Z
Announced endpoint: none
Rate limit: 6
6 slots available now.
Currently running queries (pid, space limit, time limit, start time):`;

		const withSlotsObj: OverpassStatus = {
			connectedAs: 2886860801,
			currentTime: new Date("2023-12-23T06:14:08Z"),
			ratelimit: 6,
			runningQueries: [],
			aviableSlots: 6,
		};

		const status = validateStatusStr(withSlotsStr);

		expect(status).toEqual(withSlotsObj);
	});

	it("Should handle unexpected status code", async () => {
		const statusPromise = erroringValidateStatusStr({ status: 400, contentType: TEXT_PLAIN, response: "" });

		await expect(statusPromise).rejects.toThrow(OverpassApiError);
		await expect(statusPromise).rejects.toHaveProperty("type", OverpassErrorType.UnknownError);
	});

	it("Should handle unexpected content type", async () => {
		const statusPromise = erroringValidateStatusStr({ status: 200, contentType: APP_OSM_XML, response: "" });

		await expect(statusPromise).rejects.toThrow(OverpassApiError);
		await expect(statusPromise).rejects.toHaveProperty("type", OverpassErrorType.UnknownError);
	});

	it("Should handle unexpected lines", () => {
		const status = validateResult({
			status: 200,
			contentType: TEXT_PLAIN,
			response: `${noQueriesStr}\nunexpected`,
		});

		expect(status).toEqual(noQueriesObj);
	});

	it("Should handle unexpected missing content type", async () => {
		const statusPromise = erroringValidateStatusStr({ status: 200, contentType: undefined, response: "" });

		await expect(statusPromise).rejects.toThrow(OverpassApiError);
		await expect(statusPromise).rejects.toHaveProperty("type", OverpassErrorType.UnknownError);
	});
});
