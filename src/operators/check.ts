import { Schema, SchemaBase } from "../schema";

export function check<T>(x: unknown, schema: SchemaBase<T>): T {
	if (!Schema.check(schema, x)) {
		throw new Error("check returned false instead of throwing, which is bad");
	}

	return x;
}

export const guard = check;
