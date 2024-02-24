import { parse } from "path";
import ts from "typescript";

const { base, name } = parse(process.argv[2]);

const program = ts.createProgram({
	rootNames: [`./scripts/${base}`],
	options: {
		target: ts.ScriptTarget.ES2018,
		module: ts.ModuleKind.ESNext,
		moduleResolution: ts.ModuleResolutionKind.NodeNext,

		outDir: "scripts/lib",
	},
});

const emitResult = program.emit();

if (emitResult.diagnostics.length > 0) {
	console.error("Compilation errors:");

	emitResult.diagnostics.forEach((diagnostic) => {
		console.error(
			`${diagnostic.fileName}(${diagnostic.line + 1},${diagnostic.character + 1}): ${diagnostic.messageText}`,
		);
	});

	process.exit(1)
}

try {
	const { main } = await import(`./lib/${name}.mjs`);

	await main(process.argv.slice(3))
} catch(error) {
	console.error(error);
	process.exit(1)
}