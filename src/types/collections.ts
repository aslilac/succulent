import { is } from "../operators";
import { Schema } from "../schema";

export function $map<K, V>(
	keySchema: Schema<K>,
	valueSchema: Schema<V>,
): Schema<Map<K, V>> {
	return function (x: unknown): x is Map<K, V> {
		if (!(x instanceof Map)) {
			return false;
		}

		for (const [key, value] of x) {
			if (!is(key, keySchema) || !is(value, valueSchema)) {
				return false;
			}
		}

		// If we made it through the whole map, and nothing failed, then everything passed!
		return true;
	};
}

export function $set<K>(schema: Schema<K>): Schema<Set<K>> {
	return function (x: unknown): x is Set<K> {
		if (!(x instanceof Set)) {
			return false;
		}

		for (const key of x) {
			if (!is(key, schema)) {
				return false;
			}
		}

		// If we made it through the whole map, and nothing failed, then everything passed!
		return true;
	};
}
