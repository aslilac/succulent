import { Schema, SchemaBase } from "../schema";

/**
 * @param x The value to check
 * @param schema The schema to check against
 * @throws {TypeError} when the provided value does not match the schema
 */
export function check<T>(x: unknown, schema: SchemaBase<T>): asserts x is T {
	if (!Schema.check(schema, x)) {
		throw new Error("check returned false instead of throwing, which is bad");
	}
}

export { check as guard };
