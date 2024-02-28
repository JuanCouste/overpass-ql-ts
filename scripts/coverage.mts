import parse, { LcovFile } from "lcov-parse";

async function parseLcov(path: string): Promise<LcovFile[]> {
	return new Promise<LcovFile[]>((resolve, reject) =>
		parse(path, (error, files) => {
			if (error != null || files == null) reject(error ?? new Error("Empty lcov"));
			else resolve(files);
		}),
	);
}

interface LcovItem {
	readonly hit: number;
	readonly found: number;
}

function uncovered(item: LcovItem): boolean {
	return item.hit < item.found;
}

export async function main(args: string[]) {
	const files = await parseLcov("./coverage/lcov.info");

	const uncoveredFiles = files.filter(
		({ lines, functions, branches }) => uncovered(lines) || uncovered(functions) || uncovered(branches),
	);

	if (uncoveredFiles.length == 0) {
		console.log("100% Coverage");
	} else {
		uncoveredFiles.forEach(({ file, title, lines, functions, branches }) => {
			console.error("\n", file, title, "is missing coverage");

			if (uncovered(lines)) {
				console.error(`\tLines: [${lines.hit}/${lines.found}]`);
				lines.details.filter((line) => line.hit == 0).forEach((line) => console.error(`\t\t${line.line}: x0`));
			}

			if (uncovered(functions)) {
				console.error(`\tFunctions: [${functions.hit}/${functions.found}]`);
				functions.details
					.filter((line) => line.hit == 0)
					.forEach(({ line, name }) => console.error(`\t\t${line}:${name} x0`));
			}

			if (uncovered(branches)) {
				console.error(`\tBranches: [${branches.hit}/${branches.found}]`);
				branches.details
					.filter((line) => line.taken == 0)
					.forEach(({ line, branch, block }) => console.error(`\t\t${line}: [${block}-${branch}] x0`));
			}
		});

		process.exit(1);
	}
}
