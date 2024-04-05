import { BuildApi, JBO_G_BBOX, JBO_STATUE_ID, ONLY_IDS } from "?/utils";
import { OverpassApiObject, OverpassEvaluator, OverpassItemEvaluatorBuilder } from "@/model";
import { expect } from "@jest/globals";

/**
 * There is only one element in {@link JBO_G_BBOX}
 * It's a statue node {@link JBO_STATUE_ID} that has some tags
 * historic => memorial
 * memorial => statue
 * name => Estatua a José Batlle y Ordoñez
 */

export async function ExpectJBOEvaluatorTrue(
	predicate: (e: OverpassItemEvaluatorBuilder) => OverpassEvaluator<boolean>,
) {
	const api: OverpassApiObject = BuildApi();

	const { elements } = await api.execJson((s) => s.node.filter(predicate), ONLY_IDS, JBO_G_BBOX);

	expect(elements.length).toBe(1);
	const [element] = elements;

	expect(element.id).toEqual(JBO_STATUE_ID);
	expect(element.type).toBe("node");
}

export async function ExpectJBOEvaluatorFalse(
	predicate: (e: OverpassItemEvaluatorBuilder) => OverpassEvaluator<boolean>,
) {
	const api: OverpassApiObject = BuildApi();

	const result = await api.execJson((s) => s.node.filter(predicate), ONLY_IDS, JBO_G_BBOX);

	expect(result.elements.length).toBe(0);
}
