import { OverpassFilterHelperBase } from "@/imp/api/filter/base";
import { OverpassRegExpFilter } from "@/imp/filter";
import { OverpassExpression, OverpassFilter } from "@/model";
import { OverpassFilterHelper } from "@/query";

export class OverpassRegExpFilterHelper extends OverpassFilterHelperBase {
	constructor(
		private readonly regExp: OverpassExpression<RegExp>,
		negated: boolean,
	) {
		super(negated);
	}

	clone(negated: boolean): OverpassFilterHelper {
		return new OverpassRegExpFilterHelper(this.regExp, negated);
	}

	complete(prop: OverpassExpression<string | RegExp>): OverpassFilter {
		return new OverpassRegExpFilter(prop, this.regExp, this.negated);
	}
}
