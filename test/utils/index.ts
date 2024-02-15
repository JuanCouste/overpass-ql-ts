import { readFile } from "fs/promises";

export const timeoutRemark = 'runtime error: Query timed out in "query" at line 5 after 2 seconds.';
export const memoryExhaustionRemark =
	'runtime error: Query ran out of memory in "id-query" at line 5. It would need at least 0 MB of RAM to continue.';
export const noAtticRemark = "runtime error: Tried to use museum file but no museum files available on this instance.";
export const unknownRemark = "This is an unexpected remark, it should return a generic error";

type ErrorFile = "rateLimited.html" | "badRequest.html" | "duplicateQuery.html" | "unexpected.html";

export async function getErrorFile(error: ErrorFile): Promise<string> {
	return await readFile(`./test/utils/${error}`, "utf-8");
}

export const APP_JSON = "application/json";
export const APP_OSM_XML = "application/osm3s+xml";
export const TEXT_HTML_CH = "text/html; charset=utf-8";
export const TEXT_PLAIN = "text/plain";
export const TEXT_CSV = "text/csv";
