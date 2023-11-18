import { enumObjectToArray } from "@/imp/api/enum";
import { OverpassQueryBuilder } from "@/imp/types";
import { CompileUtils, CompiledItem, CompiledSubPart, OverpassStatement } from "@/model";
import {
	CSVField,
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

	private compileSettings(settings: OverpassSettings): CompiledItem {
		if (Object.keys(settings).length == 0) {
			return this.utils.empty;
		} else {
			const options: CompiledItem[] = [];
			const { timeout, maxSize, format, globalBoundingBox, date, diff } = settings;
			if (timeout != null) {
				options.push(this.utils.raw(`[timeout:${timeout}]`));
			}
			if (maxSize != null) {
				options.push(this.utils.raw(`[maxsize:${maxSize}]`));
			}
			if (format != null) {
				if (format != OverpassFormat.CSV) {
					options.push(this.utils.raw(`[out:${OP_FORMAT[format]}]`));
				} else {
					if (settings.csvSettings == null) {
						throw new Error("csvSettings for format: csv must be supplied");
					}
					const { fields, headerLine, delimiterCharacter } = settings.csvSettings;
					const fieldStr = fields
						.map((field) => (typeof field == "string" ? field : `::${CSV_FIELDS[field]}`))
						.join(", ");
					if (headerLine != null || delimiterCharacter != null) {
						if (delimiterCharacter != null) {
							options.push(
								this.utils.raw(
									`[out:csv(${fieldStr}; ${headerLine ?? true}; "${delimiterCharacter}")]`,
								),
							);
						} else {
							options.push(this.utils.raw(`[out:csv(${fieldStr}; ${headerLine})]`));
						}
					} else {
						options.push(this.utils.raw(`[out:csv(${fieldStr})]`));
					}
				}
			}
			if (globalBoundingBox != null) {
				const [s, w, n, e] = globalBoundingBox;
				options.push(this.utils.raw(`[bbox:${s},${w},${n},${e}]`));
			}
			if (date != null) {
				options.push(this.utils.raw(`[date:"${date.toISOString()}"]`));
			}
			if (diff != null) {
				if (Array.isArray(diff)) {
					const [start, end] = diff;
					options.push(this.utils.raw(`[diff:"${start.toISOString()}","${end.toISOString()}"]`));
				}
			}
			const { nl } = this.utils;
			const compiledOptions = this.utils.join(options, "\n");
			return this.utils.template`/* Settings */${nl}${compiledOptions};${nl}`;
		}
	}

	private compileOutputOptions({
		verbosity,
		geoInfo,
		boundingBox,
		sortOrder,
		limit,
		targetSet,
	}: OverpassOutputOptions): CompiledItem {
		const params: CompiledItem[] = [];
		if (verbosity != null) {
			params.push(this.utils.raw(OP_VERBOSITY[verbosity]));
		}
		if (geoInfo != null) {
			params.push(this.utils.raw(OP_GEOINFO[geoInfo]));
		}
		if (boundingBox != null) {
			const [s, w, n, e] = boundingBox;
			params.push(this.utils.raw(`(${s},${w},${n},${e})`));
		}
		if (sortOrder != null) {
			params.push(this.utils.raw(OP_SORTORDER[sortOrder]));
		}
		if (limit != null) {
			params.push(this.utils.raw(limit.toString()));
		}
		const { nl } = this.utils;
		const target = this.utils.raw(targetSet ?? "_");
		const compiledParams = this.utils.join(params, " ");
		return this.utils.template`/* Output */${nl}.${target} out ${compiledParams};`;
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
	): CompiledSubPart[] {
		const settingsStr = this.compileSettings(settings);
		const optionsStr = this.compileOutputOptions(options);
		return this.utils.template`${settingsStr}${this.prepareStatements(statements)}${optionsStr}`.subParts;
	}
}
