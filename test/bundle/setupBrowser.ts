import { createReadStream } from "fs";
import * as fs from "fs/promises";
import * as http from "http";
import * as path from "path";
import { Browser, Page, launch } from "puppeteer-core";
import { BUNDLE_FOLDER, ESM_BUNDLE, OverpassQlTsModule } from "./setupBundles";

export type PageTestFunction<Args extends any[], Out> = (
	module: OverpassQlTsModule,
	url: string,
	...args: Args
) => Promise<Out>;

interface AugmentedWindow {
	"overpass-ql-ts": Promise<OverpassQlTsModule>;
	OVERPASS_QL_TS_URL: string;
}

const PUPPETEER_FOLDER = "./test/bundle/puppeteer/";
const SUPPORT_SERVER_PORT = 45897;

let server: http.Server;

async function setupServer() {
	server = http.createServer(function (request, response) {
		response.writeHead(200, { "Content-Type": "text/javascript" });
		createReadStream(path.join(BUNDLE_FOLDER, request.url!)).pipe(response);
	});

	return new Promise<void>((resolve) => server.listen(SUPPORT_SERVER_PORT, resolve));
}

async function launchBrowser() {
	const browser = await launch({
		headless: true,
		executablePath: process.env.OVERPASS_QL_BROWSER,
		userDataDir: path.join(PUPPETEER_FOLDER, "userData"),
		ignoreHTTPSErrors: true,
		args: ["--disable-web-security"],
	});

	let [, ...remainder] = await browser.pages();

	await Promise.all(remainder.slice(1).map(async (page) => await page.close()));

	return browser;
}

export async function setupBrowser(): Promise<Browser> {
	const [browser] = await Promise.all([launchBrowser(), setupServer()]);

	return browser;
}

export async function cleanupBrowser(browser: Browser) {
	await browser.close();
	server.close();
	await fs.rm(PUPPETEER_FOLDER, { recursive: true });
}

export async function setupPage(browser: Browser) {
	const page = await browser.newPage();

	await page.evaluate(
		(SUPPORT_SERVER_PORT, ESM_BUNDLE, OVERPASS_QL_TS_URL) => {
			const esmBundleScript = document.createElement("script");
			esmBundleScript.type = "module";
			esmBundleScript.src = `http://localhost:${SUPPORT_SERVER_PORT}/${ESM_BUNDLE}`;
			document.head.append(esmBundleScript);

			const aWindow = window as unknown as AugmentedWindow;

			aWindow["OVERPASS_QL_TS_URL"] = OVERPASS_QL_TS_URL;

			const importScript = document.createElement("script");
			importScript.innerHTML = `window["overpass-ql-ts"] = import("${esmBundleScript.src}")`;
			importScript.type = "module";
			document.head.append(importScript);
		},
		SUPPORT_SERVER_PORT,
		ESM_BUNDLE,
		process.env.OVERPASS_QL_TS_URL!,
	);

	return page;
}

export async function runTestInPage<Args extends any[], Out>(
	page: Page,
	test: PageTestFunction<Args, Out>,
	...args: Args
): Promise<Out> {
	return await page.evaluate(
		async (functionStr, ...args) => {
			const funct = eval(functionStr);
			const aWindow = window as unknown as AugmentedWindow;
			return await funct(await aWindow["overpass-ql-ts"], aWindow["OVERPASS_QL_TS_URL"], ...args);
		},
		test.toString(),
		...args,
	);
}

export async function runTestInBrowser<Args extends any[], Out>(
	browser: Browser,
	test: PageTestFunction<Args, Out>,
	...args: Args
): Promise<Out> {
	const page = await setupPage(browser);

	return await runTestInPage(page, test, ...args);
}
