import { OverpassExpression, OverpassTagFilter, OverpassTagFilterHelper } from "@/model";

export abstract class OverpassTagFilterHelperBase implements OverpassTagFilterHelper {
	constructor(protected readonly negated: boolean) {}

	abstract clone(negated: boolean): OverpassTagFilterHelper;

	not(): OverpassTagFilterHelper {
		return this.clone(!this.negated);
	}

	abstract complete(prop: OverpassExpression<string | RegExp>): OverpassTagFilter;
}
