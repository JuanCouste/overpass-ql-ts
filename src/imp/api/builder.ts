import { enumObjectToArray } from "@/imp/api/enum";
import { OverpassQueryBuilder } from "@/imp/types";
import { CompileUtils, CompiledItem, OverpassStatement } from "@/model";
import {
	CSVField,
	OverpassCSVFormatSettings,
	OverpassFormat,
	OverpassOutputGeoInfo,
	OverpassOutputOptions,
	OverpassOutputVerbosity,
	OverpassSettings,
	OverpassSortOrder,
} from "@/query";

const OP_FORMAT: string[] = enumObjectToArray<OverpassFormat, string>({
	[OverpassFormat.XML]: "xml",
	[OverpassFormat.JSON]: "json",
	[OverpassFormat.JSONText]: "json",
	[OverpassFormat.CSV]: "csv",
	[OverpassFormat.Custom]: "custom",
	[OverpassFormat.Popup]: "popup",
});

const OP_VERBOSITY: string[] = enumObjectToArray<OverpassOutputVerbosity, string>({
	[OverpassOutputVerbosity.Ids]: "ids",
	[OverpassOutputVerbosity.Geometry]: "skel",
	[OverpassOutputVerbosity.Body]: "body",
	[OverpassOutputVerbosity.Tags]: "tags",
	[OverpassOutputVerbosity.Metadata]: "meta",
});

const OP_GEOINFO: string[] = enumObjectToArray<OverpassOutputGeoInfo, string>({
	[OverpassOutputGeoInfo.Geometry]: "geom",
	[OverpassOutputGeoInfo.BoundingBox]: "bb",
	[OverpassOutputGeoInfo.Center]: "center",
});

const OP_SORTORDER: string[] = enumObjectToArray<OverpassSortOrder, string>({
	[OverpassSortOrder.Ascending]: "asc",
	[OverpassSortOrder.QuadtileIndex]: "qt",
});

const CSV_FIELDS: { [K in CSVField]: string } = {
	[CSVField.Id]: "id",
	[CSVField.Type]: "type",
	[CSVField.OType]: "otype",
	[CSVField.Latitude]: "lat",
	[CSVField.Longitude]: "lon",
	[CSVField.Version]: "version",
	[CSVField.Timestamp]: "timestamp",
	[CSVField.Changeset]: "changeset",
	[CSVField.UserId]: "uid",
	[CSVField.UserName]: "user",
	[CSVField.Count]: "count",
	[CSVField.NodeCount]: "count:nodes",
	[CSVField.WayCount]: "count:ways",
	[CSVField.RelationCount]: "count:relations",
	[CSVField.AreaCount]: "count:areas",
};

export class OverpassQueryBuilderImp implements OverpassQueryBuilder {
	constructor(private readonly utils: CompileUtils) {}

	private compileCSVFormat({ fields, delimiterCharacter, headerLine }: OverpassCSVFormatSettings): CompiledItem {
		const u = this.utils;

		const fieldStr = fields
			.map((field) => (typeof field == "string" ? field : `::${CSV_FIELDS[field]}`))
			.join(", ");

		if (headerLine != null || delimiterCharacter != null) {
			if (delimiterCharacter != null) {
				return u.raw(`[out:csv(${fieldStr}; ${headerLine ?? true}; "${delimiterCharacter}")]`);
			} else {
				return u.raw(`[out:csv(${fieldStr}; ${headerLine})]`);
			}
		} else {
			return u.raw(`[out:csv(${fieldStr})]`);
		}
	}

	private compileFormat(settings: OverpassSettings): CompiledItem {
		if (settings.format != OverpassFormat.CSV) {
			return this.utils.raw(`[out:${OP_FORMAT[settings.format!]}]`);
		} else {
			if (settings.csvSettings == null) {
				throw new Error("csvSettings for format: csv must be supplied");
			}

			return this.compileCSVFormat(settings.csvSettings);
		}
	}

	private compileSettings(settings: OverpassSettings): CompiledItem {
		const u = this.utils;
		const { nl, empty } = u;

		if (Object.keys(settings).length == 0) {
			return empty;
		}

		const { timeout, maxSize, globalBoundingBox, date, diff } = settings;
		const options: CompiledItem[] = [];

		if (timeout != null) {
			options.push(u.template`[timeout:${u.number(timeout)}]`);
		}

		if (maxSize != null) {
			options.push(u.template`[maxsize:${u.number(maxSize)}]`);
		}

		if (settings.format != null) {
			options.push(this.compileFormat(settings));
		}

		if (globalBoundingBox != null) {
			const [s, w, n, e] = u.bbox(globalBoundingBox);
			options.push(u.template`[bbox:${s},${w},${n},${e}]`);
		}

		if (date != null) {
			options.push(u.template`[date:"${u.date(date)}"]`);
		}

		if (diff != null) {
			if (Array.isArray(diff)) {
				const [start, end] = diff;
				options.push(u.raw(`[diff:"${start.toISOString()}","${end.toISOString()}"]`));
			}
		}

		return u.template`/* Settings */${nl}${u.join(options, "\n")};${nl}`;
	}

	private compileOutputOptions({
		verbosity,
		geoInfo,
		boundingBox,
		sortOrder,
		limit,
		targetSet,
	}: OverpassOutputOptions): CompiledItem {
		const u = this.utils;
		const { nl } = u;

		const params: CompiledItem[] = [];
		if (verbosity != null) {
			params.push(u.raw(OP_VERBOSITY[verbosity]));
		}
		if (geoInfo != null) {
			params.push(u.raw(OP_GEOINFO[geoInfo]));
		}
		if (boundingBox != null) {
			const [s, w, n, e] = boundingBox;
			params.push(u.raw(`(${s},${w},${n},${e})`));
		}
		if (sortOrder != null) {
			params.push(u.raw(OP_SORTORDER[sortOrder]));
		}
		if (limit != null) {
			params.push(u.raw(limit.toString()));
		}

		const target = u.raw(targetSet ?? "_");

		return u.template`/* Output */${nl}.${target} out ${u.join(params, " ")};`;
	}

	private prepareStatements(statements: OverpassStatement[]): CompiledItem {
		const compiledStatements = this.utils.join(
			statements.map((stm) => this.utils.template`${stm.compile(this.utils)};`),
			"\n",
		);
		const { nl } = this.utils;
		return this.utils.template`/* Statements */${nl}${compiledStatements}${nl}`;
	}

	public build(
		settings: OverpassSettings,
		options: OverpassOutputOptions,
		statements: OverpassStatement[],
	): CompiledItem {
		const settingsStr = this.compileSettings(settings);
		const optionsStr = this.compileOutputOptions(options);
		return this.utils.template`${settingsStr}${this.prepareStatements(statements)}${optionsStr}`;
	}
}
