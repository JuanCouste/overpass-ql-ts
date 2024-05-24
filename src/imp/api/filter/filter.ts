import { OverpassExpression, OverpassTagFilterBuilder, OverpassTagFilterHelper } from "@/model";
import { OverpassEqualsTagFilterHelper } from "./equals";
import { OverpassExistsTagFilterHelper } from "./exists";
import { OverpassRegExpTagFilterHelper } from "./regexp";

export class OverpassTagFilterBuilderImp implements OverpassTagFilterBuilder {
	private readonly negated: boolean;

	public readonly not: OverpassTagFilterBuilder;

	static Build(): OverpassTagFilterBuilder {
		return new OverpassTagFilterBuilderImp(false);
	}

	private constructor(negated: boolean, opposite?: OverpassTagFilterBuilder) {
		this.negated = negated;
		this.not = opposite ?? new OverpassTagFilterBuilderImp(!this.negated, this);
	}

	equals(value: OverpassExpression<string>): OverpassTagFilterHelper {
		return new OverpassEqualsTagFilterHelper(value, this.negated);
	}

	exists(): OverpassTagFilterHelper {
		return new OverpassExistsTagFilterHelper(this.negated);
	}

	regExp(exp: OverpassExpression<RegExp>): OverpassTagFilterHelper {
		return new OverpassRegExpTagFilterHelper(exp, this.negated);
	}
}
