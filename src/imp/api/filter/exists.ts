import { OverpassFilterHelperBase } from "@/imp/api/filter/base";
import { OverpassExistsFilter } from "@/imp/filter";
import { OverpassExpression, OverpassFilter } from "@/model";
import { OverpassFilterHelper } from "@/query";

export class OverpassExistsFilterHelper extends OverpassFilterHelperBase {
	constructor(negated: boolean) {
		super(negated);
	}

	clone(negated: boolean): OverpassFilterHelper {
		return new OverpassExistsFilterHelper(negated);
	}

	complete(prop: OverpassExpression<string | RegExp>): OverpassFilter {
		return new OverpassExistsFilter(prop as OverpassExpression<string>, this.negated);
	}
}
