import { config } from "dotenv";

config();

if (process.env.OVERPASS_QL_TS_URL == null) {
	console.error("You must set OVERPASS_QL_TS_URL env variable to point to an /api/interpreter.");
	console.error("You can use a .env file");
	process.exit(1);
}

export const OVERPASS_QL_TS_URL = process.env.OVERPASS_QL_TS_URL;
