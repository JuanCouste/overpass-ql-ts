import { readFile, writeFile } from "fs/promises";

const README_FILE = "./README.md";

function updatePackagephobiaBadge(lines: string[], version: string) {
	const sizeIndex = lines.findIndex((line) => line.startsWith("[![install size]"));

	const packagephobiaBadge = `https://packagephobia.com/badge?p=overpass-ql-ts@${version}`;
	const packagephobiaResult = `https://packagephobia.com/result?p=overpass-ql-ts@${version}`;

	lines[sizeIndex] = `[![install size](${packagephobiaBadge})](${packagephobiaResult})`;
}

export async function main([version]: string[]) {
	const readme = await readFile(README_FILE, "utf-8");
	const lines = readme.split("\n");

	updatePackagephobiaBadge(lines, version);

	const updatedReadme = lines.join("\n");
	await writeFile(README_FILE, updatedReadme);
}
