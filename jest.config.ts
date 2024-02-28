import { JestConfigWithTsJest } from "ts-jest";

// This is a sad way to indicate to bunch all tests in one file
const bunchTestsInOneFile = process.argv.slice(2).includes("--coverage=false");

export const baseConfig: JestConfigWithTsJest = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"^\\?/(.*)$": "<rootDir>/test/$1",
	},
	setupFiles: ["./test/setup.ts"],
	// Shorter may not complete for main overpass api
	testTimeout: 2000,
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
			},
		],
	},
};

export default bunchTestsInOneFile
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
