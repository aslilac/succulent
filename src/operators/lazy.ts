import { Schema } from "../schema.js";

export function lazy<T>(func: () => Schema<T>) {
	return new Schema((t: unknown): t is T => func().check(t), {
		displayName: "lazy",
	});
}
