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
	abstract compile(utils: CompileUtils): CompiledItem<string>;
}

export abstract class ComposableOverpassStatementBase
	extends OverpassStatementBase
	implements ComposableOverpassStatement
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
}

export abstract class ChainableOverpassStatementBase
	extends ComposableOverpassStatementBase
	implements ChainableOverpassStatement, AndChainableOverpassStatement
{
	constructor(
		protected readonly target: OverpassStatementTarget,
		protected readonly chain: OverpassChainableTargetableState,
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

	abstract compileChainable(utils: CompileUtils): CompiledItem<string>[];

	compile(u: CompileUtils): CompiledItem<string> {
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

	compileChainable(u: CompileUtils): CompiledItem<string>[] {
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

	compile(utils: CompileUtils): CompiledItem<string> {
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

	compile(utils: CompileUtils): CompiledItem<string> {
		const statement1 = this.statement1.compile(utils);
		return utils.template`${statement1}->.${utils.set(this.setName)}`;
	}
}

export class OverpassUnionStatement extends ComposableOverpassStatementBase {
	private constructor(private readonly statements: ComposableOverpassStatement[]) {
		super();
	}

	public static Flatten(stms: ComposableOverpassStatement[]): OverpassUnionStatement {
		return new OverpassUnionStatement(
			stms.some((stm) => stm instanceof OverpassUnionStatement)
				? stms
						.map<
							ComposableOverpassStatement[]
						>((stm) => (stm instanceof OverpassUnionStatement ? stm.statements : [stm]))
						.flat()
				: stms,
		);
	}

	public static From(
		initial: ComposableOverpassStatement,
		aditional: ComposableOverpassStatement[],
	): OverpassUnionStatement {
		return OverpassUnionStatement.Flatten([initial, ...aditional]);
	}

	compile(u: CompileUtils): CompiledItem<string> {
		const statements = this.statements.map((stm) => u.template`${stm.compile(u)};`);
		return u.template`(${u.join(statements, " ")})`;
	}
}
