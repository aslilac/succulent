import { Schema, SchemaBase } from "../schema";

export function check<T>(x: unknown, schema: SchemaBase<T>): T {
	if (!Schema.check(schema, x)) {
		throw new Error("check assertion failed");
	}

	return x;
}
