import {
	AndChainableOverpassStatement,
	ChainableOverpassStatement,
	CompileUtils,
	CompiledItem,
	ComposableOverpassStatement,
	OverpassChainableTargetableState,
	OverpassExpression,
	OverpassStatement,
	OverpassStatementTarget,
	OverpassTargetStateStatement,
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

export abstract class ChainableOverpassStatementBase
	extends ComposableOverpassStatementBase
	implements ChainableOverpassStatement, AndChainableOverpassStatement
{
	constructor(
		private readonly target: OverpassStatementTarget,
		private readonly chain: OverpassChainableTargetableState,
	) {
		super();
	}

	and(
		statement:
			| ChainableOverpassStatement
			| ((chain: OverpassChainableTargetableState) => ChainableOverpassStatement),
	): OverpassTargetStateStatement {
		const actualStatement = typeof statement == "function" ? statement(this.chain) : statement;
		return new AndChainableOverpassStatementImp(this.target, this.chain, [this, actualStatement]);
	}

	abstract compileChainable(utils: CompileUtils): CompiledItem[];

	compile(u: CompileUtils): CompiledItem {
		const target = this.target.compile(u);
		const parts = this.compileChainable(u);
		return u.template`${target} ${u.join(parts, "\n\t")}`;
	}
}

export class AndChainableOverpassStatementImp extends ChainableOverpassStatementBase {
	private readonly chained: ChainableOverpassStatement[];

	constructor(
		target: OverpassStatementTarget,
		chain: OverpassChainableTargetableState,
		chained: ChainableOverpassStatement[],
	) {
		super(target, chain);

		this.chained = chained
			.map((statement) =>
				statement instanceof AndChainableOverpassStatementImp ? statement.chained : [statement],
			)
			.flat();
	}

	compileChainable(u: CompileUtils): CompiledItem[] {
		return this.chained.map((statement) => statement.compileChainable(u)).flat();
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
