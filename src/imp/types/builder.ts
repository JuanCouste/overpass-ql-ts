import { CompiledItem, OverpassSettings, OverpassStatement } from "@/model";

export interface OverpassQueryBuilder {
	buildSettings(settings: OverpassSettings): CompiledItem;

	buildQuery(settings: OverpassSettings, statements: OverpassStatement[]): CompiledItem;
}
