import { CompileUtils, CompiledItem } from "@/model";
import { ComposableOverpassStatementBase, OverpassStatementBase } from "./base";

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

	compile(u: CompileUtils): CompiledItem {
		return this.compileFn(u).withManipulation(removeLastSemicolon);
	}
}

export class OverpassComposableRawStatement extends ComposableOverpassStatementBase {
	constructor(private readonly compileFn: (u: CompileUtils) => CompiledItem) {
		super();
	}

	compile(u: CompileUtils): CompiledItem {
		return this.compileFn(u).withManipulation(removeLastSemicolon);
	}
}
