import { OverpassEvaluatorImp } from "@/imp/evaluator/evaluator";
import {
	OverpasComparissonOperator,
	OverpassBooleanEvaluator,
	OverpassEvaluatorExpression,
	OverpassMagnitudeEvaluator,
} from "@/model";
import { OverpassComparissonEvaluatorNode } from "./compare";

export abstract class OverpassMagnitudeEvaluatorImp<T extends number | Date>
	extends OverpassEvaluatorImp<T>
	implements OverpassMagnitudeEvaluator<T>
{
	compare(op: OverpasComparissonOperator, rightExp: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator {
		const right = this.evaluatorFromExp(rightExp);
		return new OverpassEvaluatorImp.OverpassBooleanEvaluator(new OverpassComparissonEvaluatorNode(this, op, right));
	}

	lt(right: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator {
		return this.compare(OverpasComparissonOperator.Lower, right);
	}

	le(right: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator {
		return this.compare(OverpasComparissonOperator.LowerOrEquals, right);
	}

	ge(right: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator {
		return this.compare(OverpasComparissonOperator.GreaterOrEquals, right);
	}

	gt(right: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator {
		return this.compare(OverpasComparissonOperator.Greater, right);
	}
}
