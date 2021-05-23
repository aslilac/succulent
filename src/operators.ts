import { Schema } from "./schema";

export function is<T>(x: unknown, schema: Schema<T>): x is T {
	return typeof schema === "function" ? schema(x) : Object.is(x, schema);
}

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

export function that<T>(schema: Schema<T>, ...filters: Filter<T>[]): Schema<T> {
	return (x: unknown): x is T => is(x, schema) && filters.every((filter) => filter(x));
}

export function union<T extends readonly unknown[]>(
	...schemas: readonly [...Schema.WrapAll<T>]
): Schema<T[number]> {
	return (t: unknown): t is T[number] => schemas.some((schema) => is(t, schema));
}

import { $string } from "./types/string";
function hi(x: unknown) {
	if (is(x, union(1, 2, 3, $string))) {
		// if (is(x, union(1, 2, 3, "hello"))) {
		x;
	}
}

export function or<X, Y>(x: Schema<X>, y: Schema<Y>): Schema<X | Y> {
	return (t: unknown): t is X | Y => is(t, x) || is(t, y);
}

export function and<X, Y>(x: Schema<X>, y: Schema<Y>): Schema<X & Y> {
	return (t: unknown): t is X & Y => is(t, x) && is(t, y);
}
