import { BuildApi, MDEO_ID, URUGUAY_ID } from "?/utils";
import { OverpassApiObject } from "@/index";
import { expect, it } from "@jest/globals";

export function standaloneByIdTests() {
	it("Should fetch relations by id", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => s.relation.byId(URUGUAY_ID));

		expect(elements.length).toEqual(1);

		const [element] = elements;

		expect(element.id).toEqual(URUGUAY_ID);
		expect(element.type).toBe("relation");
	});

	it("Should fetch node by id", async () => {
		const api: OverpassApiObject = BuildApi();

		const { elements } = await api.execJson((s) => s.node.byId(MDEO_ID));

		expect(elements.length).toEqual(1);

		const [element] = elements;

		expect(element.id).toEqual(MDEO_ID);
		expect(element.type).toBe("node");
	});

	it("Should fetch way by id", async () => {
		const api: OverpassApiObject = BuildApi();

		const av18deJulio1 = 179061655;

		const { elements } = await api.execJson((s) => s.way.byId(av18deJulio1));

		expect(elements.length).toEqual(1);

		const [element] = elements;

		expect(element.id).toEqual(av18deJulio1);
		expect(element.type).toBe("way");
	});
}
