import { Schema, SchemaBase } from "../schema";

const hasOwn = (target: unknown, prop: string | symbol) =>
	({}.hasOwnProperty.call(target, prop));

export const $anyobject = new Schema(
	(x: unknown): x is object => typeof x === "object" && x != null,
);

export function $object<T extends object>(template: {
	[K in keyof T]: SchemaBase<T[K]>;
}): Schema<T> {
	return new Schema(
		(x: unknown): x is T =>
			typeof x === "object" &&
			x != null &&
			Reflect.ownKeys(template).every((key) =>
				// @ts-expect-error - Can't quite get these types
				Schema.check(template[key], x[key]),
			),
	);
}

export function $exact<T extends object>(template: {
	[K in keyof T]: SchemaBase<T[K]>;
}): Schema<T> {
	return new Schema(
		(x: unknown): x is T =>
			typeof x === "object" &&
			x != null &&
			Reflect.ownKeys(x).every((key) => hasOwn(template, key)) &&
			Reflect.ownKeys(template).every((key) =>
				// @ts-expect-error - Can't quite get these types
				Schema.check(template[key], x[key]),
			),
	);
}
