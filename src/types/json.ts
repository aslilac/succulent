type JsonString = string;
const objectPrototype = Object.getPrototypeOf({});
// const objectPrototype = Object.getPrototypeOf(Object.create(null));

function _json(x: unknown): [boolean, any?] {
	if (typeof x !== "string") {
		return [false];
	}

	try {
		return [true, JSON.parse(x)];
	} catch {
		return [false];
	}
}

export function $json(x: unknown): x is JsonString {
	const [valid] = _json(x);
	return valid;
}

export function $jsonobject(x: unknown): x is JsonString {
	const [valid, result] = _json(x);

	return (
		valid &&
		typeof result === "object" &&
		result != null &&
		Object.getPrototypeOf(result) === objectPrototype
	);
}

export function $jsonarray(x: unknown): x is JsonString {
	const [valid, result] = _json(x);

	return valid && Array.isArray(result);
}
