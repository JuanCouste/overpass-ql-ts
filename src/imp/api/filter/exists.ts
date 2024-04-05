import { OverpassExistsFilter } from "@/imp/filter";
import { OverpassExpression, OverpassFilter, OverpassFilterHelper } from "@/model";
import { OverpassFilterHelperBase } from "./base";

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
