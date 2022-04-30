export function toDisplayString(x: unknown) {
	switch (typeof x) {
		case "bigint":
			return `${x}n`;
		case "string":
			return `"${x}"`;
		default:
			return String(x);
	}
}
