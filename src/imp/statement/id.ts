import { ComposableOverpassStatementBase } from "@/imp/statement/base";
import { CompileUtils, CompiledItem, OverpassExpression, OverpassStatementTarget } from "@/model";

export class OverpassByIdStatement extends ComposableOverpassStatementBase {
	constructor(
		private readonly target: OverpassStatementTarget,
		private readonly id: OverpassExpression<number>,
	) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		const id = u.number(this.id);
		const target = this.target.compile(u);
		return u.template`${target}(${id})`;
	}
}
