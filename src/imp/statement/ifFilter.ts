import { CompileUtils, CompiledItem, OverpassEvaluator, OverpassStatementTarget } from "@/model";
import { ComposableOverpassStatementBase } from "./base";

export class OverpassIfFilterStatement extends ComposableOverpassStatementBase {
	constructor(
		private readonly target: OverpassStatementTarget,
		private readonly predicate: OverpassEvaluator<boolean>,
	) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		const target = this.target.compile(u);
		return u.template`${target}(if: ${this.predicate.compile(u)})`;
	}
}
