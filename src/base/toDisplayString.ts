const MAX_DISPLAY_LENGTH = 200;

export function toDisplayString(x: unknown): string {
	if (x === null || x === undefined) {
		return String(x);
	}

	switch (typeof x) {
		case "bigint":
			return `${x}n`;
		case "symbol":
			return `"${x.toString()}"`;
		case "string":
			return `"${x}"`;
		case "function":
			return "[Function]";
		case "object": {
			if (x instanceof Date) {
				return `[Date ${x.toString()}`;
			}
			if (x instanceof Set) {
				return `Set${toDisplayString([...x])}`;
			}

			const proto = Object.getPrototypeOf(x);
			if (proto === Object.prototype || proto === null || Array.isArray(x)) {
				try {
					const json = JSON.stringify(x);
					return json.length > MAX_DISPLAY_LENGTH
						? `${json.slice(0, MAX_DISPLAY_LENGTH)}…`
						: json;
				} catch {}
			}
			break;
		}
	}

	try {
		return String(x);
	} catch {
		return "[object]";
	}
}
