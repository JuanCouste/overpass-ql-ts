import { OverpassExpression, OverpassFilter } from "@/model";
import { OverpassFilterHelper } from "@/query";

export abstract class OverpassFilterHelperBase implements OverpassFilterHelper {
	constructor(protected readonly negated: boolean) {}

	abstract clone(negated: boolean): OverpassFilterHelper;

	not(): OverpassFilterHelper {
		return this.clone(!this.negated);
	}

	abstract complete(prop: OverpassExpression<string | RegExp>): OverpassFilter;
}
