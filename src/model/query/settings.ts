import { OverpassExpression } from "@/model/expression";
import { OverpassBoundingBox } from "@/model/types";

export enum OverpassFormat {
	XML,
	/** The output will be parsed */
	JSON,
	/** The output will not be parsed */
	JSONText,
	/** Additional configuration needed @see OverpassCSVSettings.csvSettings */
	CSV,
	/** HTML document with list containing maps */
	Custom,
	Popup,
}

export interface OverpassSettingsBase<F extends OverpassFormat> {
	/**
	 * Non-negative integer. Default value is 180.
	 * This parameter indicates the maximum allowed runtime for the query in seconds, as expected by the user.
	 * If the query runs longer than this time, the server may abort the query with a timeout.
	 * The second effect is, the higher this value, the more probably the server rejects the query before executing it.
	 * So, if you send a really complex big query, prefix it with a higher value; e.g., "3600" for an hour.
	 * And ensure that your client is patient enough to not abort due to a timeout in itself.
	 */
	readonly timeout?: OverpassExpression<number>;
	/**
	 * Non-negative integer. Default value is 536870912 (512 MB).
	 * This parameter indicates the maximum allowed memory for the query in bytes RAM on the server, as expected by the user.
	 * If the query needs more RAM than this value, the server may abort the query with a memory exhaustion.
	 * The second effect is, the higher this value, the more probably the server rejects the query before executing it.
	 * So, if you send a really complex big query, prefix it with a higher value; e.g., "1073741824" for a gigabyte.
	 * The maximum value highly depends on the current server load,
	 * e.g. requests for 2GB will likely be rejected during peak hours, as they don't fit into the overall resource management.
	 * Technically speaking, maxsize is treated as a 64bit signed number.
	 */
	readonly maxSize?: OverpassExpression<number>;
	/** The output format used to return OSM data. Default is {@link OverpassFormat.XML}. */
	readonly format?: F;
	/**
	 * The global bbox setting can be used to define a bounding box and then this is implicitly used in all statements
	 * (unless a statement specifies a different explicit bbox).
	 * If no bbox is specified the default value is "the entire world".
	 * In a standard Overpass QL program,
	 * a bounding box is constructed with two decimal degree coordinate pairs in ISO 6709 standard order and format,
	 * and each value is separated with a comma.
	 * The values are, in order: southern-most latitude, western-most longitude, northern-most latitude, eastern-most longitude.
	 */
	readonly globalBoundingBox?: OverpassExpression<OverpassBoundingBox>;
	/**
	 * Attic: OSM data that is no longer valid in an up-to-date dataset
	 * Modifies an Overpass QL query to examine attic data,
	 * and return results based on the OpenStreetMap database as of the date specified.
	 * This setting can be useful, for example, to reconstruct data that has been vandalized,
	 * or simply to view an object as it existed in the database at some point in the past.
	 */
	readonly date?: OverpassExpression<Date>;
	/**
	 * The diff setting lets the database determine the difference of two queries at different points in time.
	 * This is useful for example to deltas for database extracts.
	 * If only one date is supplied, the second date defaults to "now".
	 */
	readonly diff?: OverpassExpression<Date> | [OverpassExpression<Date>, OverpassExpression<Date>];
}

export enum CSVField {
	/* OSM Object ID */
	Id,
	/* OSM Object type: node, way, relation */
	Type,
	/* OSM Object as numeric value */
	OType,
	/* Latitude (available for nodes, or in out center mode) */
	Latitude,
	/* Longitude (available for nodes, or in out center mode) */
	Longitude,
	/**
	 * The following meta information fields are only available if out meta;
	 * Is used to output OSM elements.
	 */
	/* OSM object's version number */
	Version,
	/* Last changed timestamp of an OSM object */
	Timestamp,
	/* Changeset in which the object was changed */
	Changeset,
	/* OSM User id */
	UserId,
	/* OSM User name */
	UserName,
	/**
	 * The following meta information fields are only available if out count;
	 * Is used to output OSM elements.
	 */
	/* Returns total number of objects (nodes, ways, relations and areas) in inputset */
	Count,
	/* Returns number of nodes in inputset */
	NodeCount,
	/* Returns number of ways in inputset */
	WayCount,
	/* Returns number of relations in inputset */
	RelationCount,
	/* Returns number of areas in inputset  */
	AreaCount,
}

export type AnyCSVField = CSVField | string;

export interface OverpassCSVFormatSettings {
	/**
	 * The fields you want extracted, must be at least one
	 * You can extract tag fields (ie: "name") and special metadata from the element.
	 * Special fields need to be prefied with :: (ie: ::id), or used via @see CSVField
	 */
	readonly fields: [AnyCSVField, ...AnyCSVField[]];
	/** Wether to include a header line. Default is true */
	readonly headerLine?: boolean;
	/** Separator between columns. Default is Tab (↹) */
	readonly delimiterCharacter?: string;
}

export interface OverpassCSVSettings extends OverpassSettingsBase<OverpassFormat.CSV> {
	/** When {@link format} is {@link OverpassFormat.CSV}, additional csv options */
	readonly csvSettings: OverpassCSVFormatSettings;
}

export type OverpassSettings = OverpassSettingsBase<Exclude<OverpassFormat, OverpassFormat.CSV>> | OverpassCSVSettings;
