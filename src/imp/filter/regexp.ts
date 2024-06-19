import { CompileUtils, CompiledItem, OverpassExpression, OverpassTagFilter, ParamItem, ParamType } from "@/model";

export class OverpassRegExpTagFilter implements OverpassTagFilter {
	constructor(
		private readonly prop: OverpassExpression<string | RegExp>,
		private readonly regExp: OverpassExpression<RegExp>,
		public readonly negated: boolean,
	) {}

	getProp(u: CompileUtils): CompiledItem<string> {
		if (this.prop instanceof RegExp || (this.prop instanceof ParamItem && this.prop.isType(ParamType.RegExp))) {
			return u.template`~${u.regExp(this.prop)}`;
		} else {
			return u.qString(this.prop);
		}
	}

	compile(u: CompileUtils): CompiledItem<string> {
		const op = u.raw(this.negated ? "!~" : "~");
		return u.template`[${this.getProp(u)}${op}${u.regExp(this.regExp)}]`;
	}
}
