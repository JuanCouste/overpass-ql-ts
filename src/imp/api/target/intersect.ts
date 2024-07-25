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
	union(...statements: ComposableOverpassStatement[]): ComposableOverpassStatement {
		return OverpassUnionStatement.From(this, statements);
	}

	difference(statement: ComposableOverpassStatement): ComposableOverpassStatement {
		return new OverpassDifferenceStatement(this, statement);
	}

	toSet(set: OverpassExpression<string>): ComposableOverpassStatement {
		return new OverpassSetStatement(this, set);
	}

	compile(u: CompileUtils): CompiledItem<string> {
		return this.target.compile(u);
	}
}
