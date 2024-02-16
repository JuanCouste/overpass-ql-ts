import { describe } from "@jest/globals";
import { apiValidatorErrorTests } from "./error";
import { apiValidatorJsonTests } from "./json";
import { apiValidatorXmlTests } from "./xml";

describe("Validator", () => {
	describe("Error", apiValidatorErrorTests);
	describe("JSON", apiValidatorJsonTests);
	describe("XML", apiValidatorXmlTests);
});
