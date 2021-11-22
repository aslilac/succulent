import { Schema, SchemaBase } from "../schema";

export const $anyobject = new Schema(
	(x: unknown): x is object => typeof x === "object" && x != null,
);

export function $object<T extends {}>(template: {
	[K in keyof T]: SchemaBase<T[K]>;
}): Schema<T> {
	return new Schema(
		(x: unknown): x is T =>
			typeof x === "object" &&
			x != null &&
			// [
			// 	...Object.getOwnPropertyNames(template),
			// 	...Object.getOwnPropertySymbols(template),
			// ]
			Reflect.ownKeys(template).every((key) =>
				// @ts-expect-error
				Schema.check(template[key], x[key]),
			),
	);
}
