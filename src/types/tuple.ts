import { is } from "../operators";
import { Schema } from "../schema";

export function $tuple<T extends readonly unknown[]>(
	...schemas: readonly [...Schema.WrapAll<T>]
): Schema<T> {
	return (t: unknown): t is T =>
		Array.isArray(t) &&
		t.length === schemas.length &&
		schemas.every((schema, i) => is(t[i], schema));
}
