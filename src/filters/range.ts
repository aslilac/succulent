export function inRange(min: number, max: number) {
	return (x: number) => min <= x && x <= max;
}
