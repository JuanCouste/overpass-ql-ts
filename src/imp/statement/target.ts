import { CompileUtils, CompiledItem, OverpassExpression, OverpassQueryTarget, OverpassStatementTarget } from "@/model";

export class OverpassStatementTargetImp implements OverpassStatementTarget {
	constructor(
		private readonly target: OverpassExpression<OverpassQueryTarget>,
		private readonly sets: OverpassExpression<string>[],
	) {}

	withIntersection(set1: OverpassExpression<string>, ...sets: OverpassExpression<string>[]): OverpassStatementTarget {
		return new OverpassStatementTargetImp(this.target, [set1, ...sets]);
	}

	compile(u: CompileUtils): CompiledItem {
		const target = u.target(this.target);
		if (this.sets.length == 0) {
			// ie: node => node(id)
			return target;
		} else {
			// ie: node.set1.set2 => node.set1.set2(id)
			const sets = this.sets.map((set) => u.string(set));
			return u.template`${target}.${u.join(sets, ".")}`;
		}
	}
}
