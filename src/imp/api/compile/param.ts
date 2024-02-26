import { CompiledItem, ParamItem, ParamType } from "@/model";

export class OverpassParamCompiledItem<T> implements CompiledItem {
	constructor(
		private readonly param: ParamItem<T>,
		private readonly callback: (item: T) => CompiledItem,
		private readonly manipulation?: (raw: string) => string,
	) {}

	private compileParam(param: T): string {
		const raw = this.callback(param).compile([]);
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

	compile(params: any[]): string {
		const { index, type } = this.param;

		if (params.length <= index) {
			throw new Error(`Missing parameter for [${index}](${ParamType[type]}), got ${params.length} in total`);
		}

		return this.compileParam(params[index]);
	}
}
