import { ChildProcess, ExecOptions, exec as childExec } from "child_process";

export interface RunOptions {
	readonly pipeStdio?: true;
	readonly opts?: ExecOptions;
}

export function pipeChildStdio(childProcess: ChildProcess) {
	childProcess.stdout?.pipe(process.stdout);
	childProcess.stderr?.pipe(process.stderr);
}

export async function run(command: string, { pipeStdio, opts }: RunOptions = {}): Promise<void> {
	const childProcess = childExec(command, opts);

	if (pipeStdio) {
		pipeChildStdio(childProcess);
	}

	await waitFor(childProcess);
}

export function waitFor(childProcess: ChildProcess): Promise<void> {
	return new Promise((resolve, reject) => {
		childProcess.on("exit", (code) => {
			if (code) reject(code);
			else resolve();
		});
	});
}

export const overpassContainerName = "overpass-test-api";
export const networkName = "overpass-ql-ts-test";
