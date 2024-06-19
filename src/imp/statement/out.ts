import { CompileUtils, CompiledItem, OverpassOutputOptions } from "@/model";
import { OverpassStatementBase } from "./base";

export class OverpassOutStatement extends OverpassStatementBase {
	constructor(private readonly options: OverpassOutputOptions) {
		super();
	}

	compile(u: CompileUtils): CompiledItem<string> {
		const { verbosity, geoInfo, boundingBox, sortOrder, limit, targetSet } = this.options;

		const params: CompiledItem<any>[] = [];

		if (verbosity != null) {
			params.push(u.verbosity(verbosity));
		}
		if (geoInfo != null) {
			params.push(u.geoInfo(geoInfo));
		}
		if (boundingBox != null) {
			const [s, w, n, e] = u.bbox(boundingBox);
			params.push(u.template`(${s},${w},${n},${e})`);
		}
		if (sortOrder != null) {
			params.push(u.sortOrder(sortOrder));
		}
		if (limit != null) {
			params.push(u.number(limit));
		}

		const target = targetSet == null ? u.raw("_") : u.set(targetSet);

		return u.template`.${target} out ${u.join(params, " ")}`;
	}
}
