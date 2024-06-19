import { CompiledItem } from "@/model";
import { TransformCompiledItem } from "./transform";

type SubParts = string | CompiledItem<any>;
type StringParts = string | CompiledItem<string>;

export class ParentCompiledItem implements CompiledItem<string> {
	private readonly subParts: StringParts[];

	constructor(parts: SubParts[]) {
		this.subParts = ParentCompiledItem.SimplifyAndFlatten(parts);
	}

	private static SimplifyAndFlatten(parts: SubParts[]): StringParts[] {
		const subParts = parts
			.map<StringParts[]>((part) => {
				if (typeof part == "string") return [part];
				else if (part instanceof ParentCompiledItem) return part.subParts;
				else {
					const strItem = part.asString();
					return [strItem.isSimplifiable() ? strItem.simplify() : strItem];
				}
			})
			.flat();

		for (let i = subParts.length - 2; i >= 0; i--) {
			const current = subParts[i];
			const next = subParts[i + 1];
			if (typeof current == "string") {
				if (typeof next == "string") {
					subParts.splice(i, 2, current + next);
				}
			} else {
				i--;
			}
		}

		return subParts;
	}

	isSimplifiable(): boolean {
		return this.subParts.every((part) => typeof part == "string" || part.isSimplifiable());
	}

	simplify(): string {
		const unSimplifiable = this.subParts.find((part) => typeof part != "string");

		if (unSimplifiable != null) {
			throw new Error(`Unable to simplify expression ${unSimplifiable.constructor.name}`);
		}

		return this.subParts.join("");
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
		return this.subParts.map<string>((part) => (typeof part == "string" ? part : part.compile(params))).join("");
	}
}
