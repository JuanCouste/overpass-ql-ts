import { CompiledItem } from "@/model";

type SubParts = string | CompiledItem;

export class OverpassParentCompiledItem implements CompiledItem {
	private readonly subParts: SubParts[];

	constructor(
		parts: SubParts[],
		private readonly manipulation?: (raw: string) => string,
	) {
		this.subParts = parts
			.map((part) => (part instanceof OverpassParentCompiledItem ? part.flatten() : [part]))
			.flat();

		for (let i = this.subParts.length - 2; i >= 0; i--) {
			const current = this.subParts[i];
			const next = this.subParts[i + 1];
			if (typeof current == "string") {
				if (typeof next == "string") {
					this.subParts.splice(i, 2, current + next);
				}
			} else {
				i--;
			}
		}
	}

	private flatten(): SubParts[] {
		if (this.manipulation == null) {
			return this.subParts;
		} else if (this.subParts.length == 1) {
			const [part] = this.subParts;
			return [typeof part == "string" ? this.manipulation(part) : part.withManipulation(this.manipulation)];
		} else {
			return [this];
		}
	}

	withManipulation(manipulation: (raw: string) => string): CompiledItem {
		const current = this.manipulation;
		const partsCopy: SubParts[] = [...this.subParts];
		return new OverpassParentCompiledItem(
			partsCopy,
			current != null ? (raw: string) => manipulation(current(raw)) : manipulation,
		);
	}

	compile(params: any[]): string {
		const raw = this.subParts
			.map<string>((part) => (typeof part == "string" ? part : part.compile(params)))
			.join("");

		return this.manipulation != null ? this.manipulation(raw) : raw;
	}
}
