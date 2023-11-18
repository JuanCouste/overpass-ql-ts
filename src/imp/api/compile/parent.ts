import { CompiledItem, CompiledSubPart, ParentCompiledItem } from "@/model";

export class OverpassParentCompiledItem implements ParentCompiledItem {
	public readonly isParam = false;
	public readonly subParts: CompiledSubPart[];

	constructor(parts: (string | CompiledItem)[]) {
		this.subParts = parts
			.map((part) => {
				if (typeof part == "string") {
					return [part];
				} else {
					if (part.isParam) {
						return [part];
					} else {
						return part.subParts;
					}
				}
			})
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
}
