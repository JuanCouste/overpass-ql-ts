import { NaiveOverpassStringSanitizer, NoOverpassStringSanitizer } from "@/imp/sanitizer";
import { RequestAdapter } from "@/imp/types";
import { OverpassStringSanitizer } from "@/model";
import { OverpassApiObjectImp } from "./api";
import { OverpassCompileUtils } from "./compile";
import { OverpassItemEvaluatorBuilderImp } from "./evaluator";
import { OverpassTagFilterBuilderImp } from "./filter";
import { OverpassStatusValidatorImp } from "./status";
import { OverpassQueryValidatorImp } from "./validator";

export interface OverpassApiObjectOptions {
	readonly interpreterUrl?: string | URL;
	readonly statusUrl?: string | URL;
	readonly sanitization?: true | false | OverpassStringSanitizer;
}

export function GetSanitizer(sanitization: OverpassApiObjectOptions["sanitization"]): OverpassStringSanitizer {
	if (!sanitization) {
		return new NoOverpassStringSanitizer();
	} else if (sanitization === true) {
		return new NaiveOverpassStringSanitizer();
	} else {
		return sanitization;
	}
}

export function BuildOverpassApi(adapter: RequestAdapter, options?: OverpassApiObjectOptions): OverpassApiObjectImp;
/** @deprecated since 1.8.1, will be removed on 2.x.x, use {@link BuildOverpassApi} with {@link OverpassApiObjectOptions}*/
export function BuildOverpassApi(
	adapter: RequestAdapter,
	interpreterUrl?: string | URL,
	statusUrl?: string | URL,
): OverpassApiObjectImp;
/** @deprecated since 1.8.1, will be removed on 2.x.x, use {@link BuildOverpassApi} with {@link OverpassApiObjectOptions}*/
export function BuildOverpassApi(
	adapter: RequestAdapter,
	optionsOrUrl?: OverpassApiObjectOptions | string | URL,
	statusUrl?: string | URL,
): OverpassApiObjectImp;
export function BuildOverpassApi(
	adapter: RequestAdapter,
	optionsOrUrl?: OverpassApiObjectOptions | string | URL,
	statusUrl?: string | URL,
): OverpassApiObjectImp {
	if (typeof optionsOrUrl == "string" || optionsOrUrl instanceof URL) {
		console.warn("Building overpass api without OverpassApiObjectOptions has been deprecated since 1.8.1");
		console.warn("Will be removed on 2.x.x, use with OverpassApiObjectOptions");
		return PrivateBuildOverPassApi(adapter, { interpreterUrl: optionsOrUrl, statusUrl: statusUrl });
	} else {
		return PrivateBuildOverPassApi(adapter, optionsOrUrl ?? {});
	}
}

function PrivateBuildOverPassApi(adapter: RequestAdapter, options: OverpassApiObjectOptions): OverpassApiObjectImp {
	const interpreterUrl = InterpreterUrlFrom(options.interpreterUrl);
	const statusUrl = StatusUrlFrom(interpreterUrl, options.statusUrl);

	const queryValidator = new OverpassQueryValidatorImp(interpreterUrl);
	const statusValidator = new OverpassStatusValidatorImp(statusUrl);
	const sanitizer = GetSanitizer(options.sanitization);
	const compileUtils = new OverpassCompileUtils(sanitizer);
	const tagBuilder = OverpassTagFilterBuilderImp.Build();
	const evaluatorItemBuilder = new OverpassItemEvaluatorBuilderImp();

	return new OverpassApiObjectImp(
		adapter,
		interpreterUrl,
		statusUrl,
		queryValidator,
		statusValidator,
		compileUtils,
		tagBuilder,
		evaluatorItemBuilder,
	);
}

export function InterpreterUrlFrom(interpreterUrlInput?: string | URL): URL {
	return typeof interpreterUrlInput == "string"
		? new URL(interpreterUrlInput)
		: interpreterUrlInput ?? OverpassApiObjectImp.MAIN_INSTANCE;
}

export function StatusUrlFrom(interpreterUrl: URL, statusUrl?: string | URL): URL {
	return typeof statusUrl == "string" ? new URL(statusUrl) : statusUrl ?? StatusUrlFromInterpreterUrl(interpreterUrl);
}

export function StatusUrlFromInterpreterUrl(interpreterUrl: URL): URL {
	const statusUrl = new URL(interpreterUrl);
	const parts = statusUrl.pathname.split("/").filter((part) => part != "");
	if (parts.slice(-2).join("/") != "api/interpreter") {
		throw new Error(`You should provide a status url for non standard interpreter ${interpreterUrl}`);
	}
	statusUrl.pathname = [...parts.slice(0, -1), "status"].join("/");
	return statusUrl;
}

OverpassApiObjectImp.BuildDeprecated = BuildOverpassApi;
OverpassApiObjectImp.InterpreterUrlFromDeprecated = InterpreterUrlFrom;
OverpassApiObjectImp.StatusUrlFromDeprecated = StatusUrlFrom;
OverpassApiObjectImp.StatusUrlFromInterpreterUrlDeprecated = StatusUrlFromInterpreterUrl;
