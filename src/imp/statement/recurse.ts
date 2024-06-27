import { ChainableOverpassStatementBase, ComposableOverpassStatementBase } from "@/imp/statement/base";
import {
	CompileUtils,
	CompiledItem,
	OverpassChainableTargetableState,
	OverpassExpression,
	OverpassParameterError,
	OverpassQueryTarget,
	OverpassRecurseFilterStatement,
	OverpassRecurseStmType,
	OverpassStatementTarget,
} from "@/model";

export class OverpassRecurseStatement extends ComposableOverpassStatementBase {
	constructor(
		private readonly recurseType: OverpassExpression<OverpassRecurseStmType>,
		private readonly set?: OverpassExpression<string>,
	) {
		super();
	}

	compile(u: CompileUtils): CompiledItem<string> {
		const recurse = u.recurse(this.recurseType);
		if (this.set != null) {
			return u.template`.${u.set(this.set)} ${recurse}`;
		} else {
			return recurse.asString();
		}
	}
}

const TARGETS: { [K in OverpassQueryTarget]?: string } = {
	[OverpassQueryTarget.Node]: "n",
	[OverpassQueryTarget.Way]: "w",
	[OverpassQueryTarget.Relation]: "r",
};

export class OverpassRecurseFilterStatementImp
	extends ChainableOverpassStatementBase
	implements OverpassRecurseFilterStatement
{
	constructor(
		target: OverpassStatementTarget,
		chain: OverpassChainableTargetableState,
		private readonly type: OverpassExpression<OverpassQueryTarget>,
		private readonly back: boolean,
		private readonly set: OverpassExpression<string> | undefined,
		private readonly role: OverpassExpression<string> | undefined,
	) {
		super(target, chain);
	}

	inSet(set: OverpassExpression<string>): OverpassRecurseFilterStatement {
		return new OverpassRecurseFilterStatementImp(this.target, this.chain, this.type, this.back, set, this.role);
	}

	withRole(role: OverpassExpression<string>): OverpassRecurseFilterStatement {
		return new OverpassRecurseFilterStatementImp(this.target, this.chain, this.type, this.back, this.set, role);
	}

	withoutRole(): OverpassRecurseFilterStatement {
		return new OverpassRecurseFilterStatementImp(this.target, this.chain, this.type, this.back, this.set, "");
	}

	private compileSetRole(u: CompileUtils): CompiledItem<string> | null {
		if (this.set != null && this.role != null) {
			return u.template`.${u.set(this.set)}:${u.qString(this.role)}`;
		} else if (this.set != null) {
			return u.template`.${u.set(this.set)}`;
		} else if (this.role != null) {
			return u.template`:${u.qString(this.role)}`;
		} else {
			return null;
		}
	}

	private compileTarget(u: CompileUtils): CompiledItem<string> {
		const target = u.target(this.type).transform((target) => {
			if (!(target in TARGETS)) {
				throw new OverpassParameterError(`Unexpected recurse type ${target}`);
			}
			return TARGETS[target]!;
		});

		if (this.back) return u.template`b${target}`;
		else return target;
	}

	compileChainable(u: CompileUtils): CompiledItem<string>[] {
		const target = this.compileTarget(u);
		const setRole = this.compileSetRole(u);
		if (setRole != null) {
			return [u.template`(${target}${setRole})`];
		} else {
			return [u.template`(${target})`];
		}
	}
}
