import { enumObjectToArray } from "@/imp/api/enum";
import { CSVField, CompileUtils, CompiledItem, OverpassFormat, OverpassSettings } from "@/model";
import { OverpassStatementBase } from "./base";

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

export class OverpassSettingsStatement extends OverpassStatementBase {
	private constructor(private readonly settings: OverpassSettings) {
		super();
	}

	public static HasSettings(settings?: OverpassSettings): settings is OverpassSettings {
		return settings != null && Object.keys(settings).length > 0;
	}

	public static BuildSettings(settings?: OverpassSettings): OverpassSettingsStatement {
		if (!OverpassSettingsStatement.HasSettings(settings)) {
			throw new Error(`An ${this.name} should not be constructed without settings`);
		}

		if (settings.format == OverpassFormat.CSV && settings.csvSettings == null) {
			throw new Error(`csvSettings are required when format is ${OverpassFormat[OverpassFormat.CSV]}`);
		}

		return new OverpassSettingsStatement(settings);
	}

	private compileFormat(u: CompileUtils): CompiledItem<string> {
		if (this.settings.format != OverpassFormat.CSV) {
			return u.raw(`[out:${OP_FORMAT[this.settings.format!]}]`);
		} else {
			const { fields, delimiterCharacter, headerLine } = this.settings.csvSettings;

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
	}

	compile(u: CompileUtils): CompiledItem<string> {
		const { timeout, maxSize, globalBoundingBox, date, diff } = this.settings;
		const options: CompiledItem<string>[] = [];

		if (timeout != null) {
			options.push(u.template`[timeout:${u.number(timeout)}]`);
		}

		if (maxSize != null) {
			options.push(u.template`[maxsize:${u.number(maxSize)}]`);
		}

		if (this.settings.format != null) {
			options.push(this.compileFormat(u));
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

		return u.join(options, "\n");
	}
}
