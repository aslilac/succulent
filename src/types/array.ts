import { Schema, SchemaBase } from "../schema";

export function $Array<T>(base: SchemaBase<T>): Schema<T[]> {
	const itemSchema = Schema.from(base);
	const baseDisplayName = itemSchema.displayName;

	return new Schema(
		(t: unknown): t is T[] => {
			if (!Array.isArray(t)) {
				return false;
			}

			for (const each of t) {
				itemSchema.check(each);
			}

			return true;
		},
		{
			displayName: baseDisplayName.includes(" ")
				? `${baseDisplayName}[]`
				: `Array<${baseDisplayName}>`,
		},
	);
}
