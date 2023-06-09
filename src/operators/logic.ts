import { Schema, SchemaBase } from "../schema.js";
import { is } from "./is.js";

export function union<T extends readonly unknown[]>(
	...schemas: readonly [...Schema.WrapAll<T>]
): Schema<T[number]> {
	return new Schema(
		(t: unknown): t is T[number] => schemas.some((schema) => is(t, schema)),
		{
			displayName: `(${schemas
				.map((schema) => Schema.from(schema).displayName)
				.join(" | ")})`,
			*iter() {
				for (const schema of schemas) yield* Schema.from(schema);
			},
		},
	);
}

/**
 * @deprecated Use `union` instead
 */
export function or<X, Y>(x: SchemaBase<X>, y: SchemaBase<Y>): Schema<X | Y> {
	return new Schema((t: unknown): t is X | Y => is(t, x) || is(t, y), {
		displayName: `(${Schema.displayName(x)} | ${Schema.displayName(y)})`,
		*iter() {
			yield* Schema.from(x);
			yield* Schema.from(y);
		},
	});
}

export function and<X, Y>(x: SchemaBase<X>, y: SchemaBase<Y>): Schema<X & Y> {
	return new Schema((t: unknown): t is X & Y => is(t, x) && is(t, y), {
		displayName: `(${Schema.displayName(x)} & ${Schema.displayName(y)})`,
	});
}
