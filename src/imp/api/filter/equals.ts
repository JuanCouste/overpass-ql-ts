import { OverpassEqualsTagFilter } from "@/imp/filter";
import { OverpassExpression, OverpassTagFilter, OverpassTagFilterHelper } from "@/model";
import { OverpassTagFilterHelperBase } from "./base";

export class OverpassEqualsTagFilterHelper extends OverpassTagFilterHelperBase {
	constructor(
		private readonly value: OverpassExpression<string>,
		negated: boolean,
	) {
		super(negated);
	}

	clone(negated: boolean): OverpassTagFilterHelper {
		return new OverpassEqualsTagFilterHelper(this.value, negated);
	}

	complete(prop: OverpassExpression<string | RegExp>): OverpassTagFilter {
		return new OverpassEqualsTagFilter(prop as OverpassExpression<string>, this.value, this.negated);
	}
}
