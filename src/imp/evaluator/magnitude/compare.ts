import { OverpassEvaluatorNodeImp } from "@/imp/evaluator/evaluator";
import { CompileUtils, CompiledItem, OverpasComparissonOperator, OverpassEvaluator } from "@/model";

const COMPARISSON_OPERATORS: { [K in OverpasComparissonOperator]: string } = {
	[OverpasComparissonOperator.Lower]: "<",
	[OverpasComparissonOperator.LowerOrEquals]: "<=",
	[OverpasComparissonOperator.GreaterOrEquals]: ">=",
	[OverpasComparissonOperator.Greater]: ">",
};

export class OverpassComparissonEvaluatorNode<T extends number | Date> extends OverpassEvaluatorNodeImp<boolean> {
	constructor(
		private readonly left: OverpassEvaluator<T>,
		private readonly operator: OverpasComparissonOperator,
		private readonly right: OverpassEvaluator<T>,
	) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		const op = u.raw(COMPARISSON_OPERATORS[this.operator]);
		return u.template`(${this.left.compile(u)} ${op} ${this.right.compile(u)})`;
	}
}
