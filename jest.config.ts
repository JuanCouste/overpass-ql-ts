import { config } from "dotenv";
import { JestConfigWithTsJest } from "ts-jest";
import { GetEnvTimeout, ParseYesNo } from "./test/utils/env";

config();

export const baseConfig: JestConfigWithTsJest = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"^\\?/(.*)$": "<rootDir>/test/$1",
	},
	setupFiles: ["./test/setup.ts"],
	// Shorter may not complete for main overpass api
	testTimeout: GetEnvTimeout(),
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
				isolatedModules: ParseYesNo("OVERPASS_QL_TS_NODE_I", false),
			},
		],
	},
};

export default ParseYesNo("OVERPASS_QL_TEST_BUNCH", false)
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
