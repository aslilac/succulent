import { Schema, SchemaBase } from "../schema";

/**
 * Checks that a value is an object where all keys match the provided key schema, and all
 * values match the provided value schema. Equivalent to `Record<K, T>` in TypeScript.
 * @remarks
 * If `$K` is a finite type, then the keys of the value being validated must be
 * exhaustive. For example, `{@link $boolean}` has two valid values: `true` and `false`.
 * A valid `$Record($boolean, $T)` must include a key for both `true` and `false`, such as
 * `{ [true]: 1, [false]: 2 }`. This is actually not the same as `Record<boolean, T>` in
 * TypeScript, which does not require exhaustive keys.
 */
export function $Record<K extends string | number | symbol, T>(
	$K: SchemaBase<K>,
	$V: SchemaBase<T>,
): Schema<Record<K, T>> {
	const keySchema = Schema.from($K);
	const valueSchema = Schema.from($V);

	return new Schema(
		(x: unknown): x is Record<K, T> =>
			typeof x === "object" &&
			x != null &&
			Schema.every(keySchema, (key) => ({}.hasOwnProperty.call(x, key))) &&
			Object.entries(x).every(([key, value]) =>
				// It doesn't hurt if there are extra keys that don't match, as long
				// as all of the ones that should do
				Schema.is(keySchema, key) ? Schema.is(valueSchema, value) : true,
			),
		{ displayName: `Record<${keySchema.displayName}, ${valueSchema.displayName}>` },
	);
}
