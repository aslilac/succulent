import { Schema, type SchemaBase } from "../schema.js";

/**
 * When catching errors, you can use something like `error instanceof CheckError` to determine if
 * the error is from a failed call to `check`.
 */
export class CheckError extends TypeError {}

/**
 * @param x The value to check
 * @param schema The schema to check against
 * @throws {TypeError} when the provided value does not match the schema
 */
export function check<T>(x: unknown, schema: SchemaBase<T>): asserts x is T {
	if (!Schema.check(schema, x)) {
		throw new CheckError("check returned false instead of throwing, which is bad");
	}
}

export { check as guard };
