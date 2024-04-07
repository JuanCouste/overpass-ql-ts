import { OverpassRegExpTagFilter } from "@/imp/filter";
import { OverpassExpression, OverpassTagFilter, OverpassTagFilterHelper } from "@/model";
import { OverpassTagFilterHelperBase } from "./base";

export class OverpassRegExpTagFilterHelper extends OverpassTagFilterHelperBase {
	constructor(
		private readonly regExp: OverpassExpression<RegExp>,
		negated: boolean,
	) {
		super(negated);
	}

	clone(negated: boolean): OverpassTagFilterHelper {
		return new OverpassRegExpTagFilterHelper(this.regExp, negated);
	}

	complete(prop: OverpassExpression<string | RegExp>): OverpassTagFilter {
		return new OverpassRegExpTagFilter(prop, this.regExp, this.negated);
	}
}
