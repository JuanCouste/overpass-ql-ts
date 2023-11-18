import { CompileUtils, CompiledItem, OverpassExpression, OverpassFilter, ParamType } from "@/model";

export class OverpassRegExpFilter implements OverpassFilter {
	constructor(
		private readonly prop: OverpassExpression<string | RegExp>,
		private readonly regExp: OverpassExpression<RegExp>,
		public readonly negated: boolean,
	) {}

	getProp(u: CompileUtils): CompiledItem {
		if (this.prop instanceof RegExp || u.isSpecificParam<RegExp>(this.prop, ParamType.RegExp)) {
			return u.template`~"${u.regExp(this.prop)}"`;
		} else {
			return u.string(this.prop);
		}
	}

	compile(u: CompileUtils): CompiledItem {
		const op = u.raw(this.negated ? "!~" : "~");
		const prop = this.getProp(u);
		return u.template`[${prop}${op}"${u.regExp(this.regExp)}"]`;
	}
}
