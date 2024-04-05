import { CompileUtils, CompiledItem, OverpassEvaluatorNode } from "@/model";

export abstract class OverpassEvaluatorNodeImp<T> implements OverpassEvaluatorNode<T> {
	readonly _$?: T | undefined;

	abstract compile(utils: CompileUtils): CompiledItem;
}
