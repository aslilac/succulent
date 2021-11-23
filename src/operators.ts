import { Schema, SchemaBase } from "./schema";

export function is<T>(x: unknown, schema: SchemaBase<T>): x is T {
	return Schema.check(schema, x);
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

type Filter<T> = (x: T) => boolean;

export function that<T>(schema: Schema<T>, ...filters: Array<Filter<T>>): Schema<T> {
	return new Schema(
		(x: unknown): x is T => is(x, schema) && filters.every((filter) => filter(x)),
	);
}

export function union<T extends readonly unknown[]>(
	...schemas: readonly [...Schema.WrapAll<T>]
): Schema<T[number]> {
	return new Schema(
		(t: unknown): t is T[number] => schemas.some((schema) => is(t, schema)),
		function* () {
			for (const schema of schemas) yield* Schema.from(schema);
		},
	);
}

export function or<X, Y>(x: SchemaBase<X>, y: SchemaBase<Y>): Schema<X | Y> {
	return new Schema((t: unknown): t is X | Y => is(t, x) || is(t, y));
}

export function and<X, Y>(x: SchemaBase<X>, y: SchemaBase<Y>): Schema<X & Y> {
	return new Schema((t: unknown): t is X & Y => is(t, x) && is(t, y));
}
