import { Schema, SchemaBase } from "../schema";

export function $map<K, V>(
	keySchema: SchemaBase<K>,
	valueSchema: SchemaBase<V>,
): Schema<Map<K, V>> {
	return new Schema(
		(x: unknown): x is Map<K, V> => {
			if (!(x instanceof Map)) {
				return false;
			}

			for (const [key, value] of x) {
				if (!Schema.check(keySchema, key) || !Schema.check(valueSchema, value)) {
					return false;
				}
			}

			// If we made it through the whole map, and nothing failed, then everything passed!
			return true;
		},
		{
			displayName: `Map<${Schema.displayName(keySchema)}, ${Schema.displayName(
				valueSchema,
			)}>`,
		},
	);
}

export function $set<K>(schema: SchemaBase<K>): Schema<Set<K>> {
	return new Schema(
		(x: unknown): x is Set<K> => {
			if (!(x instanceof Set)) {
				return false;
			}

			for (const key of x) {
				if (!Schema.check(schema, key)) {
					return false;
				}
			}

			// If we made it through the whole set, and nothing failed, then everything passed!
			return true;
		},
		{
			displayName: `Set<${Schema.displayName(schema)}>`,
		},
	);
}
