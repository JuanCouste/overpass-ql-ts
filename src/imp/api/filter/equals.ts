import { OverpassFilterHelperBase } from "@/imp/api/filter/base";
import { OverpassEqualsFilter } from "@/imp/filter";
import { OverpassExpression, OverpassFilter } from "@/model";
import { OverpassFilterHelper } from "@/query";

export class OverpassEqualsFilterHelper extends OverpassFilterHelperBase {
	constructor(
		private readonly value: OverpassExpression<string>,
		negated: boolean,
	) {
		super(negated);
	}

	clone(negated: boolean): OverpassFilterHelper {
		return new OverpassEqualsFilterHelper(this.value, negated);
	}

	complete(prop: OverpassExpression<string | RegExp>): OverpassFilter {
		return new OverpassEqualsFilter(prop as OverpassExpression<string>, this.value, this.negated);
	}
}
