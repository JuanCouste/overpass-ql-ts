import { OverpassFormat, OverpassOutputOptions, OverpassSettings } from "@/model/query";
import { OverpassGeoPos } from "@/model/types";

export interface OverpassElementBounds {
	readonly minlat: number;
	readonly minlon: number;
	readonly maxlat: number;
	readonly maxlon: number;
}

export type OverpassBasicElementType = "node" | "way" | "relation";

export type OverpassElementType = OverpassBasicElementType | "area" | "timeline" | "count";

export interface OverpassElement<T extends OverpassElementType> {
	readonly id: number;
	readonly type: T;
}

export interface OverpassOsmElement<T extends OverpassElementType> extends OverpassElement<T> {
	readonly timestamp?: string;
	readonly version?: number;
	readonly changeset?: number;
	readonly user?: string;
	readonly uid?: number;
	readonly tags?: { [key: string]: string };
}

export interface OverpassNode extends OverpassOsmElement<"node"> {
	readonly lat: number;
	readonly lon: number;
}

export interface OverpassWay extends OverpassOsmElement<"way"> {
	readonly nodes: number[];
	readonly center?: OverpassGeoPos;
	readonly bounds?: OverpassElementBounds;
	readonly geometry?: OverpassGeoPos[];
}

export interface OverpassRelation extends OverpassOsmElement<"relation"> {
	readonly members: OverpassRelationMember[];
	readonly center?: OverpassGeoPos;
	readonly bounds?: OverpassElementBounds;
	readonly geometry?: OverpassGeoPos[];
}

export interface OverpassRelationMember {
	readonly type: OverpassBasicElementType;
	readonly ref: number;
	readonly role: string;
	readonly lon?: number;
	readonly lat?: number;
	readonly geometry?: OverpassGeoPos[];
}

export interface OverpassArea extends OverpassElement<"area"> {
	readonly tags: { [key: string]: string };
}

export interface OverpassTimeline extends OverpassElement<"timeline"> {
	readonly tags: {
		readonly reftype: string;
		readonly ref: string;
		readonly refversion: string;
		readonly created: string;
		readonly expired?: string;
	};
}
export interface OverpassCount extends OverpassElement<"count"> {
	readonly tags: {
		readonly nodes: string;
		readonly ways: string;
		readonly relations: string;
		readonly total: string;
	};
}

export type AnyOverpassElement =
	| OverpassNode
	| OverpassWay
	| OverpassRelation
	| OverpassArea
	| OverpassTimeline
	| OverpassCount;

export interface OverpassJsonOutput {
	readonly version: number;
	readonly generator: string;
	readonly osm3s: {
		readonly timestamp_osm_base: string;
		readonly timestamp_areas_base?: string;
		readonly copyright: string;
	};
	readonly remark?: string;
	readonly elements: AnyOverpassElement[];
}

export type OverpassApiOutput<
	S extends OverpassSettings,
	O extends OverpassOutputOptions,
> = S["format"] extends OverpassFormat.JSON ? OverpassJsonOutput : string;
