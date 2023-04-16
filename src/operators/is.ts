import type { ErrorRef } from "../ref";
import { Schema, SchemaBase } from "../schema";

/**
 * @param x The value to check
 * @param schema The schema to check against
 * @returns {bool} whether the provided value matches the schema
 */
export function is<T>(x: unknown, $T: SchemaBase<T>, ref?: ErrorRef): x is T {
	return Schema.is($T, x, ref);
}
