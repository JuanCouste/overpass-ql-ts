import { describe } from "@jest/globals";
import { apiValidatorErrorTests } from "./error";
import { apiValidatorJsonTests } from "./json";
import { apiValidatorXmlTests } from "./xml";

/** For information regarding tests see /test/README.md */

describe("Validator", () => {
	describe("Error", apiValidatorErrorTests);
	describe("JSON", apiValidatorJsonTests);
	describe("XML", apiValidatorXmlTests);
});
