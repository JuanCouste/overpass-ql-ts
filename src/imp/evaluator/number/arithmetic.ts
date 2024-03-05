import { OverpassEvaluatorNodeImp } from "@/imp/evaluator/evaluator";
import { CompileUtils, CompiledItem, OverpassArithmeticOperator, OverpassEvaluator } from "@/model";

const ARITHMETIC_OPERATORS: { [K in OverpassArithmeticOperator]: string } = {
	[OverpassArithmeticOperator.Add]: "+",
	[OverpassArithmeticOperator.Sub]: "-",
	[OverpassArithmeticOperator.Mult]: "*",
	[OverpassArithmeticOperator.Divide]: "/",
};

export class OverpassArithmeticEvaluatorNode extends OverpassEvaluatorNodeImp<number> {
	constructor(
		private readonly left: OverpassEvaluator<number>,
		private readonly operator: OverpassArithmeticOperator,
		private readonly right: OverpassEvaluator<number>,
	) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		const op = u.raw(ARITHMETIC_OPERATORS[this.operator]);
		return u.template`(${this.left.compile(u)} ${op} ${this.right.compile(u)})`;
	}
}
