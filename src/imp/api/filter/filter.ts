import { OverpassExpression, OverpassFilterBuilder, OverpassFilterHelper } from "@/model";
import { OverpassEqualsFilterHelper } from "./equals";
import { OverpassExistsFilterHelper } from "./exists";
import { OverpassRegExpFilterHelper } from "./regexp";

export class OverpassFilterBuilderImp implements OverpassFilterBuilder {
	private readonly negated: boolean;

	public readonly not: OverpassFilterBuilder;

	static Build(): OverpassFilterBuilder {
		return new OverpassFilterBuilderImp(false);
	}

	private constructor(negated: boolean, opposite?: OverpassFilterBuilder) {
		this.negated = negated;
		this.not = opposite ?? new OverpassFilterBuilderImp(!this.negated, this);
	}

	equals(value: OverpassExpression<string>): OverpassFilterHelper {
		return new OverpassEqualsFilterHelper(value, this.negated);
	}

	exists(): OverpassFilterHelper {
		return new OverpassExistsFilterHelper(this.negated);
	}

	regExp(exp: OverpassExpression<RegExp>): OverpassFilterHelper {
		return new OverpassRegExpFilterHelper(exp, this.negated);
	}
}
