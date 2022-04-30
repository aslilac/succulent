export function toDisplayKey(x: unknown) {
	switch (typeof x) {
		case "string":
			return x;
		default:
			return `[${String(x)}]`;
	}
}
