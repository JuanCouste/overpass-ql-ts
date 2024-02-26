import { CompiledItem, OverpassStatement } from "@/model";
import { OverpassOutputOptions, OverpassSettings } from "@/query";

export interface OverpassQueryBuilder {
	build(settings: OverpassSettings, options: OverpassOutputOptions, statements: OverpassStatement[]): CompiledItem;
}
