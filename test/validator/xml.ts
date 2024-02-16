import { expect, it } from "@jest/globals";
import { Element as XMLElement, xml2js } from "xml-js";
import {
	OverpassErrorType,
	OverpassFormat,
	OverpassOutputOptions,
	OverpassRemarkError,
	OverpassSettingsBase,
} from "../../src";
import { OverpassQueryValidatorImp } from "../../src/imp/api/validator";
import { APP_OSM_XML, MEMORY_EXHAUSTION_REMARK, NO_ATTIC_REMARK, TIMEOUT_REMARK, UNKNOWN_REMARK } from "../utils";

function validateXml(xmlNodes: string[]): string {
	const validator = new OverpassQueryValidatorImp(null!);

	const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6" generator="Overpass API 0.7.61.5 4133829e">
	<note>The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.</note>
	<meta osm_base="2024-02-08T04:14:22Z"/>
	${xmlNodes.join("\n")}
</osm>`;

	return validator.validate<OverpassSettingsBase<OverpassFormat.XML>, OverpassOutputOptions>(
		"",
		{ status: 200, contentType: APP_OSM_XML, response: xml },
		OverpassFormat.XML,
	);
}

async function validateXmlRemark(remark: string) {
	return validateXml([`<remark> ${remark} </remark>`]);
}

export function apiValidatorXmlTests() {
	it("Should run with empty response", async () => {
		const result = validateXml([]);

		const xml = xml2js(result) as XMLElement;
		const elements = xml.elements![0].elements!.slice(2);

		expect(elements.length).toBe(0);
	});

	it("Should run with some elements", async () => {
		const result = validateXml([`<node id="94329933" lat="-34.9075050" lon="-56.2218529"/>`]);

		const xml = xml2js(result) as XMLElement;
		const elements = xml.elements![0].elements!.slice(2);

		expect(elements.length).toBe(1);
	});

	it("Should handle timeout remark", async () => {
		const resultPromise = validateXmlRemark(TIMEOUT_REMARK);

		await expect(resultPromise).rejects.toThrow(OverpassRemarkError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.QueryTimeout);
	});

	it("Should handle memory exhaustion remark", async () => {
		const resultPromise = validateXmlRemark(MEMORY_EXHAUSTION_REMARK);

		await expect(resultPromise).rejects.toThrow(OverpassRemarkError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.MemoryExhaustionError);
	});

	it("Should handle no attic data remark", async () => {
		const resultPromise = validateXmlRemark(NO_ATTIC_REMARK);

		await expect(resultPromise).rejects.toThrow(OverpassRemarkError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.NoAtticData);
	});

	it("Should handle unknown remark", async () => {
		const resultPromise = validateXmlRemark(UNKNOWN_REMARK);

		await expect(resultPromise).rejects.toThrow(OverpassRemarkError);
		await expect(resultPromise).rejects.toHaveProperty("type", OverpassErrorType.QueryError);
	});
}
