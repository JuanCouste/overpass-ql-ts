import { CompileUtils, CompiledItem, OverpassExpression } from "@/model";
import { OverpassForEachBodyFunction } from "@/model/api/for";
import { OverpassStatementBase } from "./base";

export class OverpassForEachStatement extends OverpassStatementBase {
	constructor(
		private readonly body: OverpassForEachBodyFunction,
		private readonly set: OverpassExpression<string> | null,
		private readonly item: OverpassExpression<string> | undefined,
	) {
		super();
	}

	private compileDefinition(u: CompileUtils): CompiledItem<string> {
		if (this.set != null && this.item != null) {
			return u.template`foreach.${u.set(this.set)}->.${u.set(this.item)}`;
		} else if (this.set != null) {
			return u.template`foreach.${u.set(this.set)}`;
		} else if (this.item != null) {
			return u.template`foreach->.${u.set(this.item)}`;
		} else {
			return u.raw("foreach");
		}
	}

	static Tabulate(raw: string): string {
		return raw
			.split("\n")
			.map((line) => `\t${line}`)
			.join("\n");
	}

	private compileBlock(u: CompileUtils) {
		const bodyStm = this.body({ name: this.set! });
		const array = bodyStm instanceof Array ? bodyStm : [bodyStm];
		const statements = u.join(
			array.map((stm) => u.template`${stm.compile(u)};`),
			"\n",
		);
		return statements.transform(OverpassForEachStatement.Tabulate);
	}

	compile(u: CompileUtils): CompiledItem<string> {
		const foreach = this.compileDefinition(u);

		return u.template`${foreach} {${u.nl}${this.compileBlock(u)}${u.nl}}`;
	}
}
