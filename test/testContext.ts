import { OverpassBoundingBox } from "@/model";
import { OverpassFormat, OverpassOutputOptions, OverpassOutputVerbosity, OverpassSettings } from "@/query";

export const montevideoId = 296140043;
export const uruguayId = 287072;
export const mdeoDeparmentId = 1634207;
export const mdeoCityId = 2929054;
export const mdeoLabelId = 313943109;
export const plazaIndepId = 1219079;
export const palacLegId = 81683741;

export const onlyIds: OverpassOutputOptions = { verbosity: OverpassOutputVerbosity.Ids };

export const jsonFormat: OverpassSettings = { format: OverpassFormat.JSON };

export const montevideoBBox: OverpassBoundingBox = [
	-34.95946903427187, -56.336210858065294, -34.70252226444532, -56.090943633590476,
];
