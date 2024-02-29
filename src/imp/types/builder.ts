import { CompiledItem, OverpassOutputOptions, OverpassSettings, OverpassStatement } from "@/model";

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
