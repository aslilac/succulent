import { Schema, SchemaBase } from "../schema";

export function guard<T>(x: unknown, schema: SchemaBase<T>): T {
	if (!Schema.check(schema, x)) {
		throw new Error("guard assertion failed");
	}

	return x;
}
