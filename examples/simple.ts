// from "overpass-ql-ts"
import { DefaultOverpassApi, OverpassApiObject, OverpassOutputVerbosity, OverpassState } from "../src";

// This creates the query builder using platform provided http[s] clients
// You may use a specific one or leave it up to DefaultOverpassApi
// If you dont provide an url, it will default to OverpassApi main instance
const api: OverpassApiObject = DefaultOverpassApi("http://myserver/api/interpreter");

/** Get the name of some node */

const nodeId = 12345;

const {
	elements: [theNode],
} = await api.execJson((s: OverpassState) => [s.node.byId(nodeId)]);

console.log(theNode.tags?.name);

/** Get the coordinates of some hospital */
const {
	elements: [theHospital],
} = await api.execJson(
	(s: OverpassState) => [
		s.node.query({
			name: /^Hospital/,
			amenity: "hospital",
		}),
	],
	{ verbosity: OverpassOutputVerbosity.Geometry },
);

console.log(theHospital.lat, theHospital.lon);
