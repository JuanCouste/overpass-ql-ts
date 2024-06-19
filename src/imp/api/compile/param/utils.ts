export function isValidNumber(number: number): boolean {
	return typeof number == "number" && !isNaN(number) && isFinite(number);
}

export enum Axis {
	Lat,
	Lon,
}

const AXIS_RANGE: { [K in Axis]: number } = { [Axis.Lat]: 90, [Axis.Lon]: 180 };

export function isOutOfRange(number: number, axis: Axis): boolean {
	return Math.abs(number) > AXIS_RANGE[axis];
}
