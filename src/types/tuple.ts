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

type _MonotupleNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type _$Monotuple<T, N extends _MonotupleNumber, TArr extends T[]> =
	TArr["length"] extends N ? TArr : _$Monotuple<T, N, [...TArr, T]>;
type _Monotuple<T, N extends _MonotupleNumber> = _$Monotuple<T, N, []>;

export function $monotuple<T, N extends _MonotupleNumber>(
	schema: Schema<T>,
	length: N,
): Schema<_Monotuple<T, N>> {
	return (t: unknown): t is _Monotuple<T, N> =>
		Array.isArray(t) && t.length === length && t.every((x) => is(x, schema));
}
