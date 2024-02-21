import * as fs from "fs/promises";
import * as path from "path";
import { OutputOptions, rollup } from "rollup";
import { bundleList } from "../../rollup.config";

export type OverpassQlTsModule = typeof import("../../src");

export const BUNDLE_FOLDER = "./test/bundle/output/";
export const ESM_BUNDLE = "esmBundle.mjs";
export const CJS_BUNDLE = "cjsBundle.cjs";

function filterOutput(
	output: OutputOptions | OutputOptions[] | undefined,
	filter: (output: OutputOptions) => boolean,
): OutputOptions | undefined {
	if (output != null) {
		if (output instanceof Array) {
			return output.find(filter);
		} else if (filter(output)) {
			return output;
		}
	}

	return undefined;
}

async function rollupBuild(filter: (output: OutputOptions) => boolean, targetFile: string): Promise<void> {
	const rollupEsmConfig = bundleList.find(({ output }) => filterOutput(output, filter) != null)!;

	rollupEsmConfig.onwarn = () => {};

	const build = await rollup(rollupEsmConfig);

	await build.write({
		...filterOutput(rollupEsmConfig.output, filter),
		file: path.join(BUNDLE_FOLDER, targetFile),
	});
}

export async function setupBundles() {
	await Promise.all([
		rollupBuild((output) => output.format == "cjs", CJS_BUNDLE),
		rollupBuild((output) => output.format == "esm", ESM_BUNDLE),
	]);
}

export async function cleanupBundles() {
	await fs.rm(BUNDLE_FOLDER, { recursive: true });
}
