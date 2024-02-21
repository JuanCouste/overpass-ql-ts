import { CompileUtils, CompiledItem, OverpassExpression, OverpassFilter } from "@/model";

export class OverpassExistsFilter implements OverpassFilter {
	constructor(
		private readonly prop: OverpassExpression<string>,
		public readonly negated: boolean,
	) {}

	compile(u: CompileUtils): CompiledItem {
		const prop = u.qString(this.prop);
		return this.negated ? u.template`[!${prop}]` : u.template`[${prop}]`;
	}
}
