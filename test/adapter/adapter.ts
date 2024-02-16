import { HttpMethod, OverpassError, OverpassErrorType, OverpassJsonOutput, RequestAdapter } from "@/index";
import { expect, it } from "@jest/globals";
import { createServer } from "http";
import { APP_JSON, GetErrorFile, TEXT_HTML_CH, TEXT_PLAIN } from "../utils";
import { setupServerForJson, setupServerResponse, waitForServer } from "./mockServer";

export function adapterSpecificTests(adapterBuilder: () => RequestAdapter) {
	it("Should do successfull post request", async () => {
		const port = await setupServerForJson();

		const { status, contentType, response } = await adapterBuilder().request(
			new URL(`http://localhost:${port}/api/interpreter`),
			{ method: HttpMethod.Post, body: "" },
		);

		expect(status).toBe(200);
		expect(contentType).toBe(APP_JSON);

		const result = JSON.parse(response) as OverpassJsonOutput;

		expect(result.elements.length).toBe(0);
	});

	it("Should do get request", async () => {
		const port = await setupServerResponse(200, TEXT_PLAIN, "");

		const { status, contentType, response } = await adapterBuilder().request(
			new URL(`http://localhost:${port}/api/interpreter`),
		);

		expect(status).toBe(200);
		expect(contentType).toBe(TEXT_PLAIN);
		expect(response).toEqual("");
	});

	it("Should do remark request", async () => {
		const theRemark = "This is a remark";

		const port = await setupServerForJson({ remark: theRemark });

		const { status, contentType, response } = await adapterBuilder().request(
			new URL(`http://localhost:${port}/api/interpreter`),
			{ method: HttpMethod.Post, body: "" },
		);

		expect(status).toBe(200);
		expect(contentType).toBe(APP_JSON);

		const result = JSON.parse(response) as OverpassJsonOutput;

		expect(result.remark).toBe(theRemark);
	});

	it("Should handle too many requests error", async () => {
		const rateLimited = await GetErrorFile(`rateLimited.html`);

		const port = await setupServerResponse(429, TEXT_HTML_CH, rateLimited);

		const { status, contentType, response } = await adapterBuilder().request(
			new URL(`http://localhost:${port}/api/interpreter`),
			{ method: HttpMethod.Post, body: "" },
		);

		expect(status).toBe(429);
		expect(contentType).toBe(TEXT_HTML_CH);
		expect(response).toEqual(rateLimited);
	});

	it("Should handle query error", async () => {
		const badRequest = await GetErrorFile(`badRequest.html`);

		const port = await setupServerResponse(400, TEXT_HTML_CH, badRequest);

		const { status, contentType, response } = await adapterBuilder().request(
			new URL(`http://localhost:${port}/api/interpreter`),
			{ method: HttpMethod.Post, body: "" },
		);

		expect(status).toBe(400);
		expect(contentType).toBe(TEXT_HTML_CH);
		expect(response).toEqual(badRequest);
	});

	it("Should handle server error", async () => {
		const theError = "Server error";

		const port = await setupServerResponse(500, TEXT_PLAIN, theError);

		const { status, contentType, response } = await adapterBuilder().request(
			new URL(`http://localhost:${port}/api/interpreter`),
			{ method: HttpMethod.Post, body: "" },
		);

		expect(status).toBe(500);
		expect(contentType).toBe(TEXT_PLAIN);
		expect(response).toEqual(theError);
	});

	it("Should handle unexpected status", async () => {
		const theMessage = "Redirect";

		const port = await setupServerResponse(300, TEXT_PLAIN, theMessage);

		const { status, contentType, response } = await adapterBuilder().request(
			new URL(`http://localhost:${port}/api/interpreter`),
			{ method: HttpMethod.Post, body: "" },
		);

		expect(status).toBe(300);
		expect(contentType).toBe(TEXT_PLAIN);
		expect(response).toEqual(theMessage);
	});

	it("Should handle duplicate queries error", async () => {
		const duplicate = await GetErrorFile(`duplicateQuery.html`);

		const port = await setupServerResponse(200, TEXT_HTML_CH, duplicate);

		const { status, contentType, response } = await adapterBuilder().request(
			new URL(`http://localhost:${port}/api/interpreter`),
			{ method: HttpMethod.Post, body: "" },
		);

		expect(status).toBe(200);
		expect(contentType).toBe(TEXT_HTML_CH);
		expect(response).toEqual(duplicate);
	});

	it("Should handle reset", async () => {
		const server = createServer((req, res) => {
			server.close();
			req.socket.destroy();
		});

		const port = await waitForServer(server);

		const promise = adapterBuilder().request(new URL(`http://localhost:${port}/api/interpreter`), {
			method: HttpMethod.Post,
			body: "",
		});

		await expect(promise).rejects.toThrow(OverpassError);
		await expect(promise).rejects.toHaveProperty("type", OverpassErrorType.NetworkError);
	});
}
