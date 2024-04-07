import { CompileUtils, CompiledItem, OverpassExpression, OverpassTagFilter } from "@/model";

export class OverpassExistsTagFilter implements OverpassTagFilter {
	constructor(
		private readonly prop: OverpassExpression<string>,
		public readonly negated: boolean,
	) {}

	compile(u: CompileUtils): CompiledItem {
		const prop = u.qString(this.prop);
		return this.negated ? u.template`[!${prop}]` : u.template`[${prop}]`;
	}
}
