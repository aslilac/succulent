export function $string(x: unknown): x is string {
	return typeof x === "string";
}
