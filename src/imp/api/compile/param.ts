import { CompiledItem, ParamCompiledItem, ParamItem, ParentCompiledItem } from "@/model";

export class OverpassParamCompiledItem<T> implements ParamCompiledItem<T> {
	public readonly isParam = true;

	constructor(
		private readonly param: ParamItem<T>,
		private readonly callback: (item: T) => CompiledItem,
		private readonly manipulation?: (raw: string) => string,
	) {}

	public get index() {
		return this.param.index;
	}

	compile(param: T): string {
		const raw = (this.callback(param) as ParentCompiledItem).subParts.join("");
		return this.manipulation != null ? this.manipulation(raw) : raw;
	}

	withManipulation(manipulation: (raw: string) => string): CompiledItem {
		const current = this.manipulation;

		return new OverpassParamCompiledItem<T>(
			this.param,
			this.callback,
			current != null ? (raw: string) => manipulation(current(raw)) : manipulation,
		);
	}
}
