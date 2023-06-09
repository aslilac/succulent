import { Schema } from "../schema.js";

export function $Tuple<T extends unknown[]>(
	...schemas: [...Schema.WrapAll<T>]
): Schema<T> {
	return new Schema(
		(t: unknown): t is T =>
			Array.isArray(t) &&
			t.length === schemas.length &&
			schemas.every((schema, i) => Schema.check(schema, t[i])),
		{
			displayName: `[${schemas
				.map((schema) => Schema.displayName(schema))
				.join(", ")}]`,
		},
	);
}
