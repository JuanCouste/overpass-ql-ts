import { Server, createServer } from "http";
import { AddressInfo } from "net";
import { OverpassJsonOutput } from "../../src";
import { APP_JSON, JSON_OUTPUT } from "../utils";

export function waitForServer(server: Server): Promise<number> {
	return new Promise((resolve) => {
		server.listen(0, "localhost", () => resolve((server.address()! as AddressInfo).port));
	});
}

export async function setupServerResponse(statusCode: number, contentType: string, content: string): Promise<number> {
	const server = createServer((req, res) => {
		res.writeHead(statusCode, { "Content-Type": contentType });
		res.write(content);
		res.end(() => server.close());
	});

	return await waitForServer(server);
}

export function setupServerForJson(output?: Partial<OverpassJsonOutput>): Promise<number> {
	const actualOutput: OverpassJsonOutput = { ...JSON_OUTPUT, elements: [], ...output };

	return setupServerResponse(200, APP_JSON, JSON.stringify(actualOutput));
}
