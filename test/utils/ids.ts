import {
	OverpassBoundingBox,
	OverpassFormat,
	OverpassJsonOutput,
	OverpassOutputOptions,
	OverpassOutputVerbosity,
	OverpassSettings,
	OverpassSettingsNoFormat,
} from "@/model";

export const MDEO_ID = 296140043;
export const MDEO_DEP_ID = 1634207;
export const MDEO_CITY_ID = 2929054;
export const MDEO_LABEL_ID = 313943109;
export const URUGUAY_ID = 287072;
export const PLAZA_INDEP_ID = 1219079;
export const PAL_LEG_ID = 81683741;
export const JBO_STATUE_ID = 4422097133;

export const ONLY_IDS: OverpassOutputOptions = { verbosity: OverpassOutputVerbosity.Ids };

export const JSON_FORMAT: OverpassSettings = { format: OverpassFormat.JSON };

export const MDEO_BBOX: OverpassBoundingBox = [
	-34.95946903427187, -56.336210858065294, -34.70252226444532, -56.090943633590476,
];

export const PAL_LEG_BBOX: OverpassBoundingBox = [
	-34.89313931916607, -56.1902053626241, -34.88892000597966, -56.183711085621454,
];

export const JBO_BBOX: OverpassBoundingBox = [-34.8899369, -56.1865393, -34.8899369, -56.1865393];

export const JBO_G_BBOX: OverpassSettingsNoFormat = { globalBoundingBox: JBO_BBOX };

export const JSON_OUTPUT: Pick<OverpassJsonOutput, "version" | "generator" | "osm3s"> = {
	version: 0.6,
	generator: "Overpass API 0.7.61.5 4133829e",
	osm3s: {
		timestamp_osm_base: "2001-01-01T00:00:00Z",
		copyright:
			"The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
	},
};
