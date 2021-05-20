import { is } from "../operators";
import { Schema } from "../schema";

export function $record<K extends string | number | symbol, T>(
	keySchema: Schema<K>,
	valueSchema: Schema<T>,
): Schema<Record<K, T>> {
	return (x: unknown): x is Record<K, T> =>
		typeof x === "object" &&
		x != null &&
		Object.entries(x).every(
			([key, value]) => is(key, keySchema) && is(value, valueSchema),
		);
}
