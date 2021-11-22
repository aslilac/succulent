import { Schema, SchemaBase } from "../schema";

export function $record<K extends string | number | symbol, T>(
	keySchema: SchemaBase<K>,
	valueSchema: SchemaBase<T>,
): Schema<Record<K, T>> {
	return new Schema(
		(x: unknown): x is Record<K, T> =>
			typeof x === "object" &&
			x != null &&
			Schema.every(keySchema, (key) => ({}.hasOwnProperty.call(x, key))) &&
			Object.entries(x).every(([key, value]) =>
				// It doesn't hurt if there are extra keys that don't match, as long
				// as all of the ones that should do
				Schema.check(keySchema, key) ? Schema.check(valueSchema, value) : true,
			),
	);
}

// export function hasKey<K extends string, T>(
// 	key: K,
// 	keySchema: Schema<T>,
// ): Schema<{ [X in K]: T }> {
// 	return new Schema(
// 		(t: unknown): t is { [X in K]: T } =>
// 			Schema.check($anyobject, t) &&
// 			key in t &&
// 			{}.hasOwnProperty.call(t, key) &&
// 			Schema.check(keySchema, (<any>t)[key]),
// 	);
// }

// export function hasKeys<K extends string, T>(
// 	keys: K[],
// 	keySchema: Schema<T>,
// ): Schema<{ [X in K]: T }> {
// 	return new Schema((t: unknown): t is { [X in K]: T } =>
// 		keys.every((key) => Schema.check(hasKey(key, keySchema), t)),
// 	);
// }
