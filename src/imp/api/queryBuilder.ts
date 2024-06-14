import { enumObjectToArray } from "@/imp/api/enum";
import { OverpassQueryBuilder } from "@/imp/types";
import {
	CSVField,
	CompileUtils,
	CompiledItem,
	OverpassCSVFormatSettings,
	OverpassFormat,
	OverpassSettings,
	OverpassStatement,
} from "@/model";

const OP_FORMAT: string[] = enumObjectToArray<OverpassFormat, string>({
	[OverpassFormat.XML]: "xml",
	[OverpassFormat.JSON]: "json",
	[OverpassFormat.JSONText]: "json",
	[OverpassFormat.CSV]: "csv",
	[OverpassFormat.Custom]: "custom",
	[OverpassFormat.Popup]: "popup",
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

	public buildSettings(settings: OverpassSettings): CompiledItem {
		const u = this.utils;

		if (Object.keys(settings).length == 0) {
			return u.empty;
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
			if (diff instanceof Array) {
				const [start, end] = diff;
				options.push(u.template`[diff:"${u.date(start)}","${u.date(end)}"]`);
			} else {
				options.push(u.template`[diff:"${u.date(diff)}"]`);
			}
		}

		return u.template`${u.join(options, "\n")};`;
	}

	public buildQuery(settings: OverpassSettings, stms: OverpassStatement[]): CompiledItem {
		const { nl } = this.utils;
		const settStr = this.buildSettings(settings);
		const stmStr = this.utils.join(
			stms.map((stm) => this.utils.template`${stm.compile(this.utils)};`),
			"\n",
		);
		return this.utils.template`/* Settings */${nl}${settStr}${nl}/* Statements */${nl}${stmStr}${nl}`;
	}
}
