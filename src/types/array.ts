import { Schema, SchemaBase } from "../schema";

export function $array<T>(base: SchemaBase<T>): Schema<T[]> {
	const baseDisplayName = Schema.displayName(base);

	return new Schema(
		(t: unknown): t is T[] => {
			if (!Array.isArray(t)) {
				return false;
			}

			const instance = Schema.from(base);

			for (const each of t) {
				if (!instance.check(each)) {
					return false;
				}
			}

			return true;
		},
		{
			displayName:
				baseDisplayName.length < 15
					? `${baseDisplayName}[]`
					: `Array<${baseDisplayName}>`,
		},
	);
}
