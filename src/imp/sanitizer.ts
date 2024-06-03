import { OverpassStringSanitizer, StringQuoteType } from "@/model";

export class NaiveOverpassStringSanitizer implements OverpassStringSanitizer {
	sanitize(str: string, quote: StringQuoteType = StringQuoteType.Double): string {
		for (let i = 0; i < str.length; i++) {
			const current = str.charAt(i);
			switch (current) {
				case "'":
				case '"': {
					if (current == quote) {
						str = `${str.substring(0, i)}\\${str.substring(i)}`;
						i += 2;
					}
					break;
				}
				case "\\": {
					let amount = 1;
					while (str.charAt(i + amount) == "\\") {
						amount++;
					}
					i += amount - 1;

					if (amount % 2 == 1) {
						if (i == str.length - 1) {
							str = `${str}\\`;
							i += 2;
						} else {
							switch (str.charAt(i + 1)) {
								case "n":
								case "t":
								case "'":
								case '"':
									i++;
									break;
								default: {
									str = `${str.substring(0, i)}\\${str.substring(i)}`;
									i += 2;
									break;
								}
							}
						}
					}
					break;
				}
			}
		}

		return str;
	}
}

export class NoOverpassStringSanitizer implements OverpassStringSanitizer {
	sanitize(str: string, quote?: StringQuoteType | undefined): string {
		return str;
	}
}
