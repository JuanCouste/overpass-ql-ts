import { CompileUtils, CompiledItem, OverpassFilter, OverpassStatementTarget } from "@/model";
import { ComposableOverpassStatementBase } from "./base";

export class OverpassQueryStatement extends ComposableOverpassStatementBase {
	constructor(
		private readonly target: OverpassStatementTarget,
		private readonly filters: OverpassFilter[],
	) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		const target = this.target.compile(u);
		const filters = this.filters.map((filter) => filter.compile(u));

		return u.template`${target} ${u.join(filters, "\n\t")}`;
	}
}
