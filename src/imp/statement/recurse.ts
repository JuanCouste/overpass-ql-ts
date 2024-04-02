import { ComposableOverpassStatementBase } from "@/imp/statement/base";
import { CompileUtils, CompiledItem, OverpassExpression, OverpassRecurseStmType } from "@/model";

export class OverapssRecurseStatement extends ComposableOverpassStatementBase {
	constructor(
		private readonly recurseType: OverpassExpression<OverpassRecurseStmType>,
		private readonly set?: OverpassExpression<string>,
	) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		const recurse = u.recurse(this.recurseType);
		if (this.set != null) {
			return u.template`.${u.string(this.set)} ${recurse}`;
		} else {
			return recurse;
		}
	}
}
