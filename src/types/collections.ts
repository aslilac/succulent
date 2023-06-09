import { Schema, SchemaBase } from "../schema.js";

export function $Map<K, V>($K: SchemaBase<K>, $V: SchemaBase<V>): Schema<Map<K, V>> {
	const keySchema = Schema.from($K);
	const valueSchema = Schema.from($V);
	const keyTypeName = keySchema.displayName;
	const valueTypeName = valueSchema.displayName;

	return new Schema(
		(x: unknown): x is Map<K, V> => {
			if (!(x instanceof Map)) {
				return false;
			}

			for (const [key, value] of x) {
				keySchema.check(key);
				valueSchema.check(value);
			}

			// If we made it through the whole map, and nothing failed, then everything passed!
			return true;
		},
		{ displayName: `Map<${keyTypeName}, ${valueTypeName}>` },
	);
}

export function $Set<K>($K: SchemaBase<K>): Schema<Set<K>> {
	const schema = Schema.from($K);

	return new Schema(
		(x: unknown): x is Set<K> => {
			if (!(x instanceof Set)) {
				return false;
			}

			for (const key of x) {
				schema.check(key);
			}

			// If we made it through the whole set, and nothing failed, then everything passed!
			return true;
		},
		{ displayName: `Set<${schema.displayName}>` },
	);
}
