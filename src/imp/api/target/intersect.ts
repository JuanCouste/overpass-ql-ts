import { OverpassTargetStateBase } from "@/imp/api/target/base";
import { OverpassDifferenceStatement, OverpassSetStatement, OverpassUnionStatement } from "@/imp/statement/base";
import { CompileUtils, CompiledItem, ComposableOverpassStatement, OverpassExpression } from "@/model";
import { OverpassTargetState } from "@/query";

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
