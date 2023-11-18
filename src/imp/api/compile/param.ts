import { CompiledItem, ParamCompiledItem, ParamItem, ParentCompiledItem } from "@/model";

export class OverpassParamCompiledItem<T> implements ParamCompiledItem<T> {
	public readonly isParam = true;

	constructor(
		private readonly param: ParamItem<T>,
		private readonly callback: (item: T) => CompiledItem,
	) {}

	public get index() {
		return this.param.index;
	}

	compile(param: T): string {
		return (this.callback(param) as ParentCompiledItem).subParts.join("");
	}
}
