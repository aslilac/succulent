import { Schema, SchemaBase } from "../schema.js";

/**
 * @param x The value to check
 * @param schema The schema to check against
 * @returns {bool} whether the provided value matches the schema
 */
export function is<T>(x: unknown, $T: SchemaBase<T>): x is T {
	return Schema.is($T, x);
}
