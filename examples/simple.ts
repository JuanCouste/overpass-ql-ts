// from "overpass-ql-ts"
import {
	DefaultOverpassApi,
	OverpassApiObject,
	OverpassNode,
	OverpassOutputVerbosity,
	OverpassState,
} from "../src/index.js";
import { OVERPASS_QL_TS_URL } from "./env.js";

// This creates the query builder using platform provided http[s] clients
// You may use a specific one or leave it up to DefaultOverpassApi
// If you dont provide an url, it will default to OverpassApi main instance
const api: OverpassApiObject = DefaultOverpassApi(OVERPASS_QL_TS_URL);

/** Get the name of some node */

const nodeId = 296140043;

const nodeResult = await api.execJson((s: OverpassState) => [s.node.byId(nodeId)]);

const theNode = nodeResult.elements[0] as OverpassNode;

console.log(theNode.tags?.name);

/** Get the coordinates of some hospital */
const hospitals = await api.execJson(
	(s: OverpassState) => [
		s.node.query({
			name: /^Hospital/,
			amenity: "hospital",
		}),
	],
	{ verbosity: OverpassOutputVerbosity.Geometry },
);

const theHospital = hospitals.elements[0] as OverpassNode;

console.log("Hospital location:", theHospital.lat, theHospital.lon);
