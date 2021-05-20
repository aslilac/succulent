import { Schema } from "../schema";

export function $anyobject(x: unknown): x is object {
	return typeof x === "object" && x != null;
}

export function $object<T extends {}>(
	template: { [K in keyof T]: Schema<T[K]> },
): Schema<T> {
	return (x: unknown): x is T =>
		typeof x === "object" &&
		x != null &&
		// [
		// 	...Object.getOwnPropertyNames(template),
		// 	...Object.getOwnPropertySymbols(template),
		// ]
		Reflect.ownKeys(template).every((key) =>
			// @ts-expect-error
			template[key](x[key]),
		);
}

// export function hasKey<K extends string, T>(
// 	key: K,
// 	keySchema: Schema<T>,
// ): Schema<{ [X in K]: T }> {
// 	return (t: unknown): t is { [X in K]: T } =>
// 		$object(t) &&
// 		key in t &&
// 		{}.hasOwnProperty.call(t, key) &&
// 		keySchema((<any>t)[key]);
// }

// export function hasKeys<K extends string, T>(
// 	keys: K[],
// 	keySchema: Schema<T>,
// ): Schema<{ [X in K]: T }> {
// 	return (t: unknown): t is { [X in K]: T } =>
// 		keys.every((key) => hasKey(key, keySchema)(t));
// }
