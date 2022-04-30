import type { ErrorRef } from "../ref";
import { Schema, SchemaBase } from "../schema";

export function is<T>(x: unknown, schema: SchemaBase<T>, ref?: ErrorRef): x is T {
	return Schema.is(schema, x, ref);
}
