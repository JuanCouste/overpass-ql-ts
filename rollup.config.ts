import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { RollupOptions } from "rollup";
import { dts } from "rollup-plugin-dts";

export const bundleList: RollupOptions[] = [
	{
		/* CommonJS Bundle */
		input: "src/index.ts",
		output: [
			{
				file: "lib/cjs-bundle.cjs",
				format: "cjs",
			},
		],
		plugins: [
			typescript({ sourceMap: false, tsconfig: "./tsconfig.build.json" }),
			commonjs(),
			nodeResolve({ preferBuiltins: true }),
		],
		external: /^https?$/,
	},
	{
		/* ESM Bundle */
		input: "src/index.ts",
		output: {
			file: "lib/esm-bundle.mjs",
			format: "esm",
		},
		plugins: [
			typescript({ sourceMap: false, tsconfig: "./tsconfig.build.json" }),
			nodeResolve({ preferBuiltins: true }),
		],
		external: /^https?$/,
	},
	{
		/* Types Bundle */
		input: "lib/index.d.ts",
		output: {
			file: "lib/types-bundle.d.ts",
			format: "es",
		},
		plugins: [dts({ tsconfig: "./tsconfig.build.json" })],
		external: /^https?$/,
	},
];

export default bundleList;
