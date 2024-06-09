export enum StringQuoteType {
	Single = "'",
	Double = '"',
}

export interface OverpassStringSanitizer {
	/**
	 * Sanitizes a string that would be wrapped in {@link quote}
	 * @param str The string to be sanitized
	 * @param quote The quote that wraps the string, defaults to {@link StringQuoteType.Double}
	 */
	sanitize(str: string, quote?: StringQuoteType): string;
}
