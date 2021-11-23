import { Schema, SchemaBase } from "../schema";

export interface ArraySchemaOptions {
	/**
	 * An item is considered `empty` when it's index `i` is a positive integer or zero,
	 * less than the `length` of the `Array` `t`, but `i in t` is false. For example,
	 * `new Array(10)` returns an `Array` with 10 `empty` items. The difference between
	 * `undefined` and `empty` is that iterators will not iterate over `empty`, but they
	 * will iterate over `undefined`. You should only enable this if you *really* need it.
	 */
	allowEmpty?: boolean;

	/**
	 * Throw an error instead of returning `false` if there is a type mismatch
	 */
	trace?: boolean;
}

export function $array<T>(
	schema: SchemaBase<T>,
	options: ArraySchemaOptions = {},
): Schema<T[]> {
	const { allowEmpty = false, trace = false } = options;

	return new Schema((t: unknown): t is T[] => {
		if (!Array.isArray(t)) {
			return false;
		}

		const instance = Schema.from(schema);

		if (allowEmpty) {
			return t.every((each) => instance.check(each));
		}

		for (const each of t) {
			if (!instance.check(each)) {
				return false;
			}
		}

		return true;
	});
}
