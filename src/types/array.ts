import { Schema } from "../schema";

export function $array<T>(schema: Schema<T>): Schema<T[]> {
	return (t: unknown): t is T[] =>
		Array.isArray(t) && t.every((x) => schema(x));
}
