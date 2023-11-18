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

export class OverpassStringStatement extends OverpassStatementBase {
	private readonly statement: string;

	constructor(statement: string) {
		super();
		this.statement = removeLastSemicolon(statement);
	}

	compile(u: CompileUtils): CompiledItem {
		return u.raw(this.statement);
	}
}

export class OverpassComposableStringStatement extends ComposableOverpassStatementBase {
	private readonly statement: string;

	constructor(statement: string) {
		super();
		this.statement = removeLastSemicolon(statement);
	}

	compile(u: CompileUtils): CompiledItem {
		return u.raw(this.statement);
	}
}
