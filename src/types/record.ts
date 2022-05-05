import { Schema, SchemaBase } from "../schema";

export function $Record<K extends string | number | symbol, T>(
	keySchemaBase: SchemaBase<K>,
	valueSchemaBase: SchemaBase<T>,
): Schema<Record<K, T>> {
	const keySchema = Schema.from(keySchemaBase);
	const valueSchema = Schema.from(valueSchemaBase);

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
