import { networkName, overpassContainerName, run } from "./containers.mjs";

const imageName = "overpass-jest-test";

const envVariables = {
	OVERPASS_QL_TS_URL: `http://${overpassContainerName}/api/interpreter`,
	OVERPASS_QL_BUNDLING: "Yes",
};

async function main() {
	await run(`docker build --network ${networkName} -t ${imageName} .`, { pipeStdio: true });

	const envParams = Object.entries(envVariables)
		.map(([key, val]) => `-e ${key}="${val}"`)
		.join(" ");

	const args = process.argv.slice(2);
	const runCmd = `docker run -i --rm --network ${networkName} ${envParams} --name overpass-jest-test ${imageName}`;
	const runCmdWithArgs = args.length == 0 ? runCmd : `${runCmd} ${args.map((arg) => `"${arg}"`).join(" ")}`;

	console.log(runCmdWithArgs);

	await run(runCmdWithArgs, { pipeStdio: true });
}

main().then(console.log, console.error);
