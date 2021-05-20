export function $boolean(x: unknown): x is boolean {
	return typeof x === "boolean";
}

export function $undefined(x: unknown): x is undefined {
	return x === undefined;
}

export function $null(x: unknown): x is null {
	return x === null;
}

export function $NaN(x: unknown): x is typeof NaN {
	return x !== x;
}
