import { CompiledItem, OverpassStatement } from "@/model";
import { OverpassOutputOptions, OverpassSettings } from "@/query";

export interface OverpassQueryBuilder {
	buildSettings(settings: OverpassSettings): CompiledItem;

	buildOptions(settings: OverpassOutputOptions): CompiledItem;

	buildStatements(statements: OverpassStatement[]): CompiledItem;

	buildQuery(
		settings: OverpassSettings,
		options: OverpassOutputOptions,
		statements: OverpassStatement[],
	): CompiledItem;
}
