import { Schema, SchemaBase } from "../schema";

export function $array<T>(schema: SchemaBase<T>): Schema<T[]> {
	return new Schema(
		(t: unknown): t is T[] =>
			Array.isArray(t) && t.every((x) => Schema.check(schema, x)),
	);
}
