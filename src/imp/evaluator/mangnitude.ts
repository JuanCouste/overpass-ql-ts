import { OverpassBooleanEvaluator, OverpassEvaluatorExpression, OverpassMagnitudeEvaluator } from "@/model";
import { OverpassEvaluatorImp } from "./evaluator";

export abstract class OverpassMagnitudeEvaluatorImp<T extends number | Date>
	extends OverpassEvaluatorImp<T>
	implements OverpassMagnitudeEvaluator<T>
{
	lt(evaluator: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator {
		throw new Error("Method not implemented.");
	}

	le(evaluator: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator {
		throw new Error("Method not implemented.");
	}

	ge(evaluator: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator {
		throw new Error("Method not implemented.");
	}

	gt(evaluator: OverpassEvaluatorExpression<T>): OverpassBooleanEvaluator {
		throw new Error("Method not implemented.");
	}
}
