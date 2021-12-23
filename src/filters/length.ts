type HasLength = { length: number };

export function hasLength(length: number) {
	return (x: HasLength) => x.length === length;
}

export function minLength(length: number) {
	return (x: HasLength) => x.length >= length;
}

export function maxLength(length: number) {
	return (x: HasLength) => x.length <= length;
}

export function nonEmpty(x: HasLength) {
	return x.length > 0;
}
