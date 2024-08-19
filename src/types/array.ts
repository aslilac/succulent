import { Schema, type SchemaBase } from "../schema.js";

/**
 * Checks that the value is an `Array`, and that every value in it matches `$T`
 * @param $T The schema to check each value in the `Array` against
 * @example
 * ```ts
 * guard([], $Array($number)); // ok
 * guard([1, 2, 3], $Array($number)); // ok
 * guard([1, 2, "three"], $Array($number)); // will throw a `TypeError`, because `"three"` is a `string`
 * ```
 */
export function $Array<T>($T: SchemaBase<T>): Schema<T[]> {
	const itemSchema = Schema.from($T);
	const baseDisplayName = itemSchema.displayName;

	return new Schema(
		(t: unknown): t is T[] => {
			if (!Array.isArray(t)) {
				return false;
			}

			for (const each of t) {
				itemSchema.check(each);
			}

			return true;
		},
		{
			displayName: baseDisplayName.includes(" ")
				? `${baseDisplayName}[]`
				: `Array<${baseDisplayName}>`,
		},
	);
}
