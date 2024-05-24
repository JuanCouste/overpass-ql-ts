import { OverpassExistsTagFilter } from "@/imp/filter";
import { OverpassExpression, OverpassTagFilter, OverpassTagFilterHelper } from "@/model";
import { OverpassTagFilterHelperBase } from "./base";

export class OverpassExistsTagFilterHelper extends OverpassTagFilterHelperBase {
	constructor(negated: boolean) {
		super(negated);
	}

	clone(negated: boolean): OverpassTagFilterHelper {
		return new OverpassExistsTagFilterHelper(negated);
	}

	complete(prop: OverpassExpression<string | RegExp>): OverpassTagFilter {
		return new OverpassExistsTagFilter(prop as OverpassExpression<string>, this.negated);
	}
}
