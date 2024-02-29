import { OverpassOutputGeoInfo, OverpassOutputVerbosity, OverpassSortOrder } from "@/model/enum";
import { OverpassExpression } from "@/model/expression";
import { OverpassBoundingBox } from "@/model/types";

export interface OverpassOutputOptions {
	/** Target set to output.
	 * Default is _
	 */
	readonly targetSet?: OverpassExpression<string>;
	/**
	 * Degree of verbosity of the output.
	 * Default is @see {OverpassOutputVerbosity.Body}
	 */
	readonly verbosity?: OverpassExpression<OverpassOutputVerbosity>;
	/**
	 * Amount of geolocated information.
	 * Default is none
	 */
	readonly geoInfo?: OverpassExpression<OverpassOutputGeoInfo>;
	/**
	 * Only elements whose coordinates are inside this bounding box are produced.
	 * For way segments,
	 * the first or last coordinates outside this bounding box are also produced to allow for properly formed segment
	 * (this restriction has no effect on derived elements without any geometry).
	 */
	readonly boundingBox?: OverpassExpression<OverpassBoundingBox>;

	readonly sortOrder?: OverpassExpression<OverpassSortOrder>;

	/** A non-negative integer, which limits the output to a maximum of the given number. */
	readonly limit?: OverpassExpression<number>;
}
