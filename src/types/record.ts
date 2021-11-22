import { Schema, SchemaBase } from "../schema";

export function $record<K extends string | number | symbol, T>(
	keySchema: SchemaBase<K>,
	valueSchema: SchemaBase<T>,
): Schema<Record<K, T>> {
	return new Schema(
		(x: unknown): x is Record<K, T> =>
			typeof x === "object" &&
			x != null &&
			Object.entries(x).every(
				([key, value]) =>
					Schema.check(keySchema, key) && Schema.check(valueSchema, value),
			),
	);
}
