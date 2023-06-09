export function toDisplayString(x: unknown) {
	switch (typeof x) {
		case "bigint":
			return `${x}n`;
		case "string":
			return `"${x}"`;
		default:
			try {
				return String(x);
			} catch {
				return "[object]";
			}
	}
}
