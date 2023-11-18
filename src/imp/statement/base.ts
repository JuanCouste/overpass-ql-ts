import {
	CompileUtils,
	CompiledItem,
	ComposableOverpassStatement,
	OverpassExpression,
	OverpassStatement,
} from "@/model";

export abstract class OverpassStatementBase implements OverpassStatement {
	abstract compile(utils: CompileUtils): CompiledItem;
}

export abstract class ComposableOverpassStatementBase
	extends OverpassStatementBase
	implements ComposableOverpassStatement
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
}

export class OverpassDifferenceStatement extends ComposableOverpassStatementBase {
	constructor(
		private readonly statement1: ComposableOverpassStatement,
		private readonly statement2: ComposableOverpassStatement,
	) {
		super();
	}

	compile(utils: CompileUtils): CompiledItem {
		const statement1 = this.statement1.compile(utils);
		const statement2 = this.statement2.compile(utils);
		return utils.template`(${statement1}; - ${statement2};)`;
	}
}

export class OverpassSetStatement extends ComposableOverpassStatementBase {
	constructor(
		private readonly statement1: ComposableOverpassStatement,
		private readonly setName: OverpassExpression<string>,
	) {
		super();
	}

	compile(utils: CompileUtils): CompiledItem {
		const statement1 = this.statement1.compile(utils);
		return utils.template`${statement1}->.${utils.string(this.setName)}`;
	}
}

export class OverpassUnionStatement extends ComposableOverpassStatementBase {
	constructor(
		private readonly statement1: ComposableOverpassStatement,
		private readonly statement2: ComposableOverpassStatement,
	) {
		super();
	}

	compile(utils: CompileUtils): CompiledItem {
		const statement1 = this.statement1.compile(utils);
		const statement2 = this.statement2.compile(utils);
		return utils.template`(${statement1}; ${statement2};)`;
	}
}
