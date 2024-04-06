import { CompileUtils, CompiledItem, OverpassExpression, OverpassTagFilter } from "@/model";

export class OverpassEqualsTagFilter implements OverpassTagFilter {
	constructor(
		private readonly prop: OverpassExpression<string>,
		private readonly value: OverpassExpression<string>,
		private readonly negated: boolean,
	) {}

	compile(u: CompileUtils): CompiledItem {
		const op = u.raw(this.negated ? "!=" : "=");
		return u.template`[${u.qString(this.prop)}${op}${u.qString(this.value)}]`;
	}
}
