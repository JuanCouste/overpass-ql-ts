import { exec as childExec } from "child_process";
import { networkName, overpassContainerName, pipeChildStdio, run, waitFor } from "./containers.mjs";

const imageName = "juancouste/overpass-test-api:1.3";
const envVariables = {
	OVERPASS_RATE_LIMIT: 0,
	OVERPASS_ALLOW_DUPLICATE_QUERIES: "yes",
};

export async function main(args: string[]) {
	if (!args.some((arg) => arg == "--local")) {
		console.log("[1] Pulling image");
		await run(`docker pull ${imageName}`, { pipeStdio: true });
	} else {
		console.log("[1] Using local image");
		const queryProcess = childExec(`docker images -q ${imageName}`, (error, stdout) => {
			if (stdout != "") console.log("Image found");
		});
		await waitFor(queryProcess);
	}

	console.log("[2] Network setup");
	try {
		await run(`docker network create ${networkName}`, { pipeStdio: true });
	} catch (error) {
		console.log("Network already exists, it will be reused");
	}

	console.log("[3] Cheking running container");
	try {
		await run(`docker stop ${overpassContainerName}`, { pipeStdio: true });
		await run(`docker rm ${overpassContainerName}`, { pipeStdio: true });
		console.log("Container was runing, terminated");
	} catch (error) {}

	console.log("[4] Running container");
	const envParams = Object.entries(envVariables)
		.map(([key, val]) => `-e ${key}="${val}"`)
		.join(" ");
	const container = childExec(
		`docker run -p 127.0.0.1:80:80 -i --rm --network ${networkName} ${envParams} --name ${overpassContainerName} ${imageName}`,
	);

	pipeChildStdio(container);

	await waitFor(container);

	console.log("Container was terminated");
}
