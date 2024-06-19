import { CompiledItem, OverpassExpression, ParamItem, ParamType } from "@/model";
import { TransformCompiledItem } from "../transform";

export abstract class BaseParamCompiledItem<F, T> implements CompiledItem<T> {
	constructor(private readonly value: OverpassExpression<F>) {}

	protected abstract validateParam(param: F): T;

	protected abstract compilePram(param: T): string;

	isSimplifiable(): boolean {
		return !(this.value instanceof ParamItem);
	}

	simplify(): T {
		if (this.value instanceof ParamItem) {
			throw new Error(`Tried to simplify a parameter`);
		} else {
			return this.validateParam(this.value);
		}
	}

	transform(callback: (raw: T) => string): CompiledItem<string> {
		return new TransformCompiledItem<T>(this, callback);
	}

	asString(): CompiledItem<string> {
		return new TransformCompiledItem<T>(this, this.compilePram.bind(this));
	}

	private getValue(params: any[]): F {
		if (this.value instanceof ParamItem) {
			const { index, type } = this.value;

			if (params.length <= index) {
				throw new Error(`Missing parameter for [${index}](${ParamType[type]}), got ${params.length} in total`);
			}

			return params[index];
		} else {
			return this.value;
		}
	}

	resolve(params: any[]): T {
		return this.validateParam(this.getValue(params));
	}

	compile(params: any[]): string {
		return this.compilePram(this.resolve(params));
	}
}
