import { config } from "dotenv";
import { JestConfigWithTsJest } from "ts-jest";

config();

function parseYesNo(env: string | undefined, defaultValue: boolean): boolean {
	switch (env?.toLocaleLowerCase()) {
		case "yes":
		case "y":
		case "true":
			return true;
		case "no":
		case "n":
		case "false":
			return false;
		default:
			return defaultValue;
	}
}

export const baseConfig: JestConfigWithTsJest = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"^\\?/(.*)$": "<rootDir>/test/$1",
	},
	setupFiles: ["./test/setup.ts"],
	// Shorter may not complete for main overpass api
	testTimeout: +(process.env.OVERPASS_QL_TIMEOUT ?? 2000),
	coverageDirectory: "coverage",
	coveragePathIgnorePatterns: ["test/", "scripts/", ".*\\.config\\.ts"],
	openHandlesTimeout: 0,
	transform: {
		// Warns about moduleInterop
		"^.+\\.ts$": [
			"ts-jest",
			{
				useESM: true,
				diagnostics: { ignoreCodes: ["TS151001"] },
				isolatedModules: parseYesNo(process.env.OVERPASS_QL_TS_NODE_I, false),
			},
		],
	},
};

export default parseYesNo(process.env.OVERPASS_QL_TEST_BUNCH, false)
	? {
			...baseConfig,
			testMatch: ["**/test.spec.ts"],
			testPathIgnorePatterns: [],
		}
	: {
			...baseConfig,
			testMatch: ["**/*.spec.ts"],
			testPathIgnorePatterns: ["test/test.spec.ts"],
		};
