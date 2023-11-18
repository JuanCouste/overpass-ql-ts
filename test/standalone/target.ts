import {
	AnyOverpassQueryTarget,
	OverpassApiObject,
	OverpassBoundingBox,
	OverpassJsonOutput,
	OverpassSettings,
	OverpassState,
	OverpassStatement,
	OverpassTargetState,
} from "../../src";
import { onlyIds } from "../testContext";

type TargetMapStatementFunction<Method extends keyof OverpassTargetState> = (
	...args: Parameters<OverpassTargetState[Method]>
) => OverpassStatement;

type TargetStateStatementFunction<Method extends keyof OverpassTargetState> = (
	target: AnyOverpassQueryTarget,
	...args: Parameters<OverpassTargetState[Method]>
) => OverpassStatement;

async function fetchTargetMap<Method extends keyof OverpassTargetState>(
	api: OverpassApiObject,
	method: Method,
	target: AnyOverpassQueryTarget,
	params: Parameters<OverpassTargetState[Method]>,
	globalBBox?: OverpassBoundingBox,
): Promise<OverpassJsonOutput> {
	const settings: OverpassSettings = { globalBoundingBox: globalBBox };

	const result = await api.execJson(
		(s: OverpassState) => [(s[target][method] as TargetMapStatementFunction<Method>)(...params)],
		onlyIds,
		settings,
	);

	return result as OverpassJsonOutput;
}

async function fetchTargetState<Method extends keyof OverpassTargetState>(
	api: OverpassApiObject,
	method: Method,
	target: AnyOverpassQueryTarget,
	params: Parameters<OverpassTargetState[Method]>,
	globalBBox?: OverpassBoundingBox,
): Promise<OverpassJsonOutput> {
	const settings: OverpassSettings = { globalBoundingBox: globalBBox };

	const result = await api.execJson(
		(s: OverpassState) => {
			const statement = (s[method] as TargetStateStatementFunction<Method>)(target, ...params);
			return [statement];
		},
		onlyIds,
		settings,
	);

	return result as OverpassJsonOutput;
}

export async function fetchFormsOfStatementWithBBox<Method extends keyof OverpassTargetState>(
	api: OverpassApiObject,
	method: Method,
	targets: AnyOverpassQueryTarget[],
	globalBBox?: OverpassBoundingBox,
	...params: Parameters<OverpassTargetState[Method]>
): Promise<OverpassJsonOutput[]> {
	if (targets.length == 0) {
		throw `Missing fetchFormsOfStatement targets`;
	}
	return await Promise.all<OverpassJsonOutput>(
		targets
			.map<
				Promise<OverpassJsonOutput>[]
			>((target) => [fetchTargetMap(api, method, target, params, globalBBox), fetchTargetState(api, method, target, params, globalBBox)])
			.flat(),
	);
}

export async function fetchFormsOfStatement<Method extends keyof OverpassTargetState>(
	api: OverpassApiObject,
	method: Method,
	targets: AnyOverpassQueryTarget[],
	...params: Parameters<OverpassTargetState[Method]>
): Promise<OverpassJsonOutput[]> {
	return await fetchFormsOfStatementWithBBox(api, method, targets, undefined, ...params);
}
