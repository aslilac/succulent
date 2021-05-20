export function $number(x: unknown): x is number {
	return typeof x === "number" && x === x;
}
