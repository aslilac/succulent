import { Schema, SchemaBase } from "../schema";

export function $array<T>(schema: SchemaBase<T>): Schema<T[]> {
	return new Schema((t: unknown): t is T[] => {
		if (!Array.isArray(t)) {
			return false;
		}

		const instance = Schema.from(schema);

		for (const each of t) {
			if (!instance.check(each)) {
				return false;
			}
		}

		return true;
	});
}
