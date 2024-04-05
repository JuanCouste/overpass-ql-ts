import { OverpassDifferenceStatement, OverpassSetStatement, OverpassUnionStatement } from "@/imp/statement";
import {
	CompileUtils,
	CompiledItem,
	ComposableOverpassStatement,
	OverpassExpression,
	OverpassTargetState,
} from "@/model";
import { OverpassTargetStateBase } from "./base";

export class OverpassChainableIntersectStatement
	extends OverpassTargetStateBase
	implements ComposableOverpassStatement, OverpassTargetState
{
	union(statement: ComposableOverpassStatement): ComposableOverpassStatement {
		return new OverpassUnionStatement(this, statement);
	}

	difference(statement: ComposableOverpassStatement): ComposableOverpassStatement {
		return new OverpassDifferenceStatement(this, statement);
	}

	toSet(set: OverpassExpression<string>): ComposableOverpassStatement {
		return new OverpassSetStatement(this, set);
	}

	compile(u: CompileUtils): CompiledItem {
		return this.target.compile(u);
	}
}
