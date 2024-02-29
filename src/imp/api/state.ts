import { OverpassChainableIntersectStatement, OverpassTargetMapStateImp } from "@/imp/api/target";
import {
	OverapssRecurseStatement,
	OverpassComposableRawStatement,
	OverpassRawStatement,
	OverpassStatementTargetImp,
} from "@/imp/statement";
import {
	CompileUtils,
	CompiledItem,
	ComposableOverpassStatement,
	OverpassExpression,
	OverpassQueryTarget,
	OverpassRecurseStmType,
	OverpassStatement,
} from "@/model";
import {
	AnyOverpassQueryTarget,
	OverpassFilterBuilder,
	OverpassQueryTargetExpression,
	OverpassQueryTargetString,
	OverpassState,
	OverpassStateMethods,
	OverpassTargetMapState,
	OverpassTargetState,
} from "@/query";

const STATEMENT_METHOD = (function () {
	const enumObj: { [K in keyof OverpassTargetState]: true } = {
		bbox: true,
		byId: true,
		inside: true,
		query: true,
	};
	return Object.keys(enumObj);
})();

const TARGETS: { [K in OverpassQueryTargetString]: OverpassQueryTarget } = {
	node: OverpassQueryTarget.Node,
	way: OverpassQueryTarget.Way,
	relation: OverpassQueryTarget.Relation,
	any: OverpassQueryTarget.NodeWayRelation,
};

function AnyTargetToQueryTarget(anyTarget: OverpassQueryTargetExpression): OverpassExpression<OverpassQueryTarget> {
	return typeof anyTarget == "string" ? TARGETS[anyTarget] : anyTarget;
}

const STRING_TARGETS: string[] = Object.keys(TARGETS);

type TargetFunction<K extends keyof OverpassTargetState> = (
	...args: Parameters<OverpassTargetState[K]>
) => ReturnType<OverpassTargetState[K]>;

type PropFunction<K extends keyof OverpassTargetState> = (
	target: AnyOverpassQueryTarget,
	...args: Parameters<OverpassTargetState[K]>
) => ReturnType<OverpassTargetState[K]>;

type Functions = {
	[K in keyof OverpassTargetState]?: PropFunction<K>;
};

export class OverpassStateImp implements OverpassStateMethods {
	public readonly proxy: OverpassState;

	private readonly targets: Map<OverpassQueryTarget, OverpassTargetMapState> = new Map();
	private readonly functions: Functions = {};

	constructor(private readonly utils: CompileUtils, private readonly filterBuilder: OverpassFilterBuilder) {
		const stateProxy = new Proxy<OverpassStateImp>(this, { get: this.proxyGet });
		this.proxy = stateProxy as unknown as OverpassState;
	}

	static Build(utils: CompileUtils, filterBuilder: OverpassFilterBuilder): OverpassState {
		const state = new OverpassStateImp(utils, filterBuilder);
		return state.proxy;
	}

	private getTarget(anyTarget: AnyOverpassQueryTarget): OverpassTargetState {
		const target = AnyTargetToQueryTarget(anyTarget) as OverpassQueryTarget;
		let targetState = this.targets.get(target);
		if (targetState == null) {
			const statementTarget = new OverpassStatementTargetImp(target, []);
			targetState = new OverpassTargetMapStateImp(statementTarget, this.utils, this.filterBuilder);
			this.targets.set(target, targetState);
		}
		return targetState;
	}

	private buildFunction<K extends keyof OverpassTargetState>(state: OverpassStateImp, prop: K): PropFunction<K> {
		return (target: AnyOverpassQueryTarget, ...args: Parameters<OverpassTargetState[K]>) =>
			(state.getTarget(target)[prop] as TargetFunction<K>)(...args);
	}

	private getFunction<K extends keyof OverpassTargetState>(state: OverpassStateImp, prop: K): PropFunction<K> {
		let funct: PropFunction<K> | undefined = this.functions[prop];
		if (funct == null) {
			this.functions[prop] = this.buildFunction<K>(state, prop) as PropFunction<keyof OverpassTargetState>;
			funct = this.functions[prop];
		}
		return funct!;
	}

	private proxyGet(state: OverpassStateImp, prop: string | symbol): any {
		if (typeof prop == "string") {
			if (STRING_TARGETS.includes(prop)) {
				return state.getTarget(prop as OverpassQueryTargetString);
			} else if (STATEMENT_METHOD.includes(prop)) {
				return state.getFunction(state, prop as keyof OverpassTargetState);
			} else if (!isNaN(+prop)) {
				return state.getTarget(+prop);
			}
		}

		return state[prop as keyof OverpassStateImp];
	}

	statement(statement: string): OverpassStatement;
	statement(compile: (utils: CompileUtils) => CompiledItem): OverpassStatement;
	statement(input: string | ((utils: CompileUtils) => CompiledItem)): OverpassStatement {
		return new OverpassRawStatement(typeof input == "string" ? (u) => u.raw(input) : input);
	}

	composableStatement(statement: string): ComposableOverpassStatement;
	composableStatement(compile: (utils: CompileUtils) => CompiledItem): ComposableOverpassStatement;
	composableStatement(input: string | ((utils: CompileUtils) => CompiledItem)): ComposableOverpassStatement {
		return new OverpassComposableRawStatement(typeof input == "string" ? (u) => u.raw(input) : input);
	}

	set(
		anyTargetExp: OverpassQueryTargetExpression,
		set: OverpassExpression<string>,
	): ComposableOverpassStatement & OverpassTargetState {
		return this.intersect(anyTargetExp, set);
	}

	intersect(
		anyTargetExp: OverpassQueryTargetExpression,
		set1: OverpassExpression<string>,
		...sets: OverpassExpression<string>[]
	): ComposableOverpassStatement & OverpassTargetState {
		const target = AnyTargetToQueryTarget(anyTargetExp);
		const statementTarget = new OverpassStatementTargetImp(target, [set1, ...sets]);
		return new OverpassChainableIntersectStatement(statementTarget, this.utils, this.filterBuilder);
	}

	recurse(
		type: OverpassExpression<OverpassRecurseStmType>,
		input?: OverpassExpression<string> | undefined,
	): ComposableOverpassStatement {
		return new OverapssRecurseStatement(type, input);
	}
}
