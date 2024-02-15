import { ComposableOverpassStatementBase, OverpassStatementBase } from "@/imp/statement/base";
import { CompileUtils, CompiledItem } from "@/model";

function removeLastSemicolon(statement: string) {
	statement = statement.trim();
	if (statement.endsWith(";")) {
		return statement.slice(0, -1).trim();
	} else {
		return statement;
	}
}

export class OverpassRawStatement extends OverpassStatementBase {
	constructor(private readonly compileFn: (u: CompileUtils) => CompiledItem) {
		super();
	}

	public static FromString(statement: string) {
		statement = removeLastSemicolon(statement);
		return new OverpassRawStatement((u) => u.raw(statement));
	}

	compile(u: CompileUtils): CompiledItem {
		return this.compileFn(u);
	}
}

export class OverpassComposableRawStatement extends ComposableOverpassStatementBase {
	constructor(private readonly compileFn: (u: CompileUtils) => CompiledItem) {
		super();
	}

	public static FromString(statement: string) {
		statement = removeLastSemicolon(statement);
		return new OverpassComposableRawStatement((u) => u.raw(statement));
	}

	compile(u: CompileUtils): CompiledItem {
		return this.compileFn(u);
	}
}
