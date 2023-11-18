export function enumObjectToArray<Enum extends number, V>(object: { [K in Enum]: V }): V[] {
	const entries = Object.entries(object);
	const values: V[] = new Array(entries.length);
	entries.forEach(([key, value]) => {
		values[+key] = value as V;
	});
	return [...values];
}
