import { OverpassBoundingBox } from "@/model";

export enum OverpassOutputVerbosity {
	/** Print only the ids of the elements in the set. */
	Ids,
	/**
	 * Print the minimum information necessary for geometry:
	 *  - nodes: id and coordinates
	 *  - ways: id and the ids of its member nodes
	 *  - relations: id of the relation, and the id, type, and role of all of its members.
	 */
	Geometry,
	/**
	 * Print all information necessary to use the data.
	 * These are also tags for all elements and the roles for relation members.
	 */
	Body,
	/** Print only ids and tags for each element and not coordinates or members. */
	Tags,
	/**
	 * Print everything known about the elements.
	 * Includes everything output by body for each OSM element, as well as the version,
	 * changeset id, timestamp, and the user data of the user that last touched the object.
	 * Derived elements' metadata attributes are also missing for derived elements.
	 */
	Metadata,
}

export enum OverpassOutputGeoInfo {
	/**
	 * Add the full geometry to each object.
	 * This adds coordinates to each node, to each node member of a way or relation,
	 * and it adds a sequence of "nd" members with coordinates to all relations.
	 */
	Geometry,
	/**
	 * Adds only the bounding box of each element to the element.
	 * For nodes this is equivalent to geom. For ways it is the enclosing bounding box of all nodes.
	 * For relations it is the enclosing bounding box of all node and way members, relations as members have no effect.
	 */
	BoundingBox,
	/**
	 * This adds only the centre of the above mentioned bounding box to ways and relations.
	 * Note: The center point is not guaranteed to lie inside the polygon (example).
	 */
	Center,
}

export enum OverpassSortOrder {
	/** Sort by object id */
	Ascending,
	/**
	 * Sort by quadtile index;
	 * This is roughly geographical and significantly faster than order by ids
	 * (derived elements generated by make or convert statements without any geometry will be grouped separately,
	 * only sorted by id).
	 */
	QuadtileIndex,
}

export interface OverpassOutputOptions {
	/** Target set to output.
	 * Default is _
	 */
	readonly targetSet?: string;
	/**
	 * Degree of verbosity of the output.
	 * Default is @see {OverpassOutputVerbosity.Body}
	 */
	readonly verbosity?: OverpassOutputVerbosity;
	/**
	 * Amount of geolocated information.
	 * Default is none
	 */
	readonly geoInfo?: OverpassOutputGeoInfo;
	/**
	 * Only elements whose coordinates are inside this bounding box are produced.
	 * For way segments,
	 * the first or last coordinates outside this bounding box are also produced to allow for properly formed segment
	 * (this restriction has no effect on derived elements without any geometry).
	 */
	readonly boundingBox?: OverpassBoundingBox;

	readonly sortOrder?: OverpassSortOrder;

	/** A non-negative integer, which limits the output to a maximum of the given number. */
	readonly limit?: number;
}