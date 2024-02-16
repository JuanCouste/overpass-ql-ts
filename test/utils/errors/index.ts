import { readFile } from "fs/promises";

type ErrorFile = "rateLimited.html" | "badRequest.html" | "duplicateQuery.html" | "unexpected.html";

export async function GetErrorFile(error: ErrorFile): Promise<string> {
	return await readFile(`./test/utils/errors/${error}`, "utf-8");
}
