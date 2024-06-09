export function parseYesNo(env: string | undefined, defaultValue: boolean): boolean {
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

export function ParseYesNo(varName: string, defaultValue: boolean): boolean {
	switch (process.env[varName]?.toLocaleLowerCase()) {
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

export function GetEnvTimeout(multiplier: number = 1) {
	return +(process.env.OVERPASS_QL_TIMEOUT ?? 2000) * multiplier;
}
