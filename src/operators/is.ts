import { Schema, SchemaBase } from "../schema";

export function is<T>(x: unknown, schema: SchemaBase<T>): x is T {
	return Schema.is(schema, x);
}
