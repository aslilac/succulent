import { Schema } from "../schema";

type JsonString = string;
const objectPrototype = Object.getPrototypeOf({}) as unknown;
// const objectPrototype = Object.getPrototypeOf(Object.create(null));

function _json(x: unknown): [boolean, unknown?] {
	if (typeof x !== "string") {
		return [false];
	}

	try {
		return [true, JSON.parse(x)];
	} catch {
		return [false];
	}
}

export const $json = new Schema((x: unknown): x is JsonString => {
	const [valid] = _json(x);
	return valid;
});

export const $jsonobject = new Schema((x: unknown): x is JsonString => {
	const [valid, result] = _json(x);

	return (
		valid &&
		typeof result === "object" &&
		result != null &&
		Object.getPrototypeOf(result) === objectPrototype
	);
});

export const $jsonarray = new Schema((x: unknown): x is JsonString => {
	const [valid, result] = _json(x);

	return valid && Array.isArray(result);
});
