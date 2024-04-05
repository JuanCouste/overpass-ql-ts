import { BuildApi, ONLY_IDS, PAL_LEG_BBOX } from "?/utils";
import { OverpassApiObject } from "@/model";
import { expect, it } from "@jest/globals";
import { ExpectJBOEvaluatorFalse, ExpectJBOEvaluatorTrue } from "./utils";

export function elementEvaluatorTests() {
	it("Should handle evaluator element type", async () => await ExpectJBOEvaluatorTrue((e) => e.type().eq("node")));

	it("Should handle evaluator element has tag", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.hasTag("name").and(e.hasTag("population").not())));

	it("Should handle evaluator element get tag", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.getTag("historic").eq("memorial").and(e.getTag("name").neq("memorial"))));

	it("Should handle evaluator conditional", async () =>
		await ExpectJBOEvaluatorFalse((e) => e.conditional(e.true, e.false, e.true)));

	it("Should handle evaluator and", async () => await ExpectJBOEvaluatorFalse((e) => e.and(e.true, e.false)));

	it("Should handle evaluator or", async () => await ExpectJBOEvaluatorTrue((e) => e.or(e.true, e.false)));

	it("Should handle evaluator raw number", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.number((u) => u.raw("1")).eq(1)));

	it("Should handle evaluator raw string", async () =>
		await ExpectJBOEvaluatorTrue((e) => e.string((u) => u.qString("1")).asBool()));

	it("Should handle evaluator global boolean", async () => await ExpectJBOEvaluatorTrue((e) => e.boolean(true)));

	it("Should handle evaluator count tags", async () => await ExpectJBOEvaluatorTrue((e) => e.count.tags().eq(3)));

	it("Should handle evaluator count members", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => s.way.filter((e) => e.count.members().gt(80)), ONLY_IDS, {
			globalBoundingBox: PAL_LEG_BBOX,
		});

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(1225793598);
		expect(element.type).toBe("way");
	});

	it("Should handle evaluator count members distinct", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson(
			(s) =>
				s.relation.filter((e) =>
					e.count.members().neq(e.count.membersDistinct()).and(e.count.members().gt(350)),
				),
			ONLY_IDS,
			{ globalBoundingBox: [-34.909437024091005, -56.18667689228674, -34.90914881051326, -56.18625785018251] },
		);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(5553100);
		expect(element.type).toBe("relation");
	});

	it("Should handle evaluator count by role", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson(
			(s) => s.relation.filter((e) => e.id().eq(1217750).and(e.count.byRole("street").eq(28))),
			ONLY_IDS,
			{ globalBoundingBox: PAL_LEG_BBOX },
		);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(1217750);
		expect(element.type).toBe("relation");
	});

	it("Should handle evaluator count by role", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson(
			(s) => s.relation.filter((e) => e.count.byRole("street").neq(e.count.byRoleDistinct("street"))),
			ONLY_IDS,
			{ globalBoundingBox: [-34.91812954075949, -56.17054011516751, -34.91223511663051, -56.16478945895897] },
		);

		expect(elements.length).toBe(1);
		const [element] = elements;

		expect(element.id).toEqual(1218959);
		expect(element.type).toBe("relation");
	});
}
