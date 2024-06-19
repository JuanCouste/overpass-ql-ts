import { CompiledItem } from "@/model";

export class TransformCompiledItem<T> implements CompiledItem<string> {
	constructor(
		private readonly item: CompiledItem<T>,
		private readonly callback: (raw: T) => string,
	) {}

	isSimplifiable(): boolean {
		return this.item.isSimplifiable();
	}

	simplify(): string {
		return this.callback(this.item.simplify());
	}

	transform(callback: (raw: string) => string): CompiledItem<string> {
		return new TransformCompiledItem<string>(this, callback);
	}

	asString(): CompiledItem<string> {
		return this;
	}

	resolve(params: any[]): string {
		return this.compile(params);
	}

	compile(params: any[]): string {
		return this.callback(this.item.resolve(params));
	}
}
