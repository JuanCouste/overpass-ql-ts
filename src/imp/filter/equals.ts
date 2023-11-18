import { CompileUtils, CompiledItem, OverpassExpression, OverpassFilter } from "@/model";

export class OverpassEqualsFilter implements OverpassFilter {
	constructor(
		private readonly prop: OverpassExpression<string>,
		private readonly value: OverpassExpression<string>,
		private readonly negated: boolean,
	) {}

	compile(u: CompileUtils): CompiledItem {
		const op = u.raw(this.negated ? "!=" : "=");
		const prop = u.string(this.prop);
		const value = u.string(this.value);
		return u.template`[${prop}${op}"${value}"]`;
	}
}
