import { keyReporter, messages, toDisplayKey } from "../base";
import { Schema, SchemaBase } from "../schema";

function hasOwn(target: unknown, prop: string | symbol) {
	if (!{}.hasOwnProperty.call(target, prop)) {
		throw null;
	}

	return true;
}

type KeyValuePair = readonly [key: unknown, valueSchema: SchemaBase<unknown>];
const toDisplayKeyValue = ([key, valueSchema]: KeyValuePair) =>
	`${toDisplayKey(key)}: ${Schema.displayName(valueSchema)}`;

export const $anyobject = new Schema(
	(x: unknown): x is object => typeof x === "object" && x != null,
	{ displayName: "object" },
);

export function $object<T extends object>(template: {
	[K in keyof T]: SchemaBase<T[K]>;
}): Schema<T> {
	return new Schema(
		(x: unknown): x is T => {
			const [report, resolve] = keyReporter(
				// @ts-expect-error - Can't quite get these types
				(key: string | symbol) => Schema.check(template[key], x[key]),
				// @ts-expect-error - Can't quite get these types
				(key) => messages.invalidProperty(key, template[key] as Schema<unknown>),
			);

			return (
				$anyobject.check(x) &&
				(Reflect.ownKeys(template).forEach(report), resolve())
			);
		},

		{
			displayName: `{${Reflect.ownKeys(template)
				// @ts-expect-error - Can't quite get these types
				.map((key) => [key, template[key]] as const)
				.map(toDisplayKeyValue)
				.join(", ")}}`,
		},
	);
}

export function $exact<T extends object>(template: {
	[K in keyof T]: SchemaBase<T[K]>;
}): Schema<T> {
	return new Schema(
		(x: unknown): x is T => {
			const [reportUnknown, resolveUnknown] = keyReporter(
				(key: string | symbol) => hasOwn(template, key),
				(key) => `Unexpected property ${toDisplayKey(key)}`,
			);

			const [reportKnown, resolveKnown] = keyReporter(
				// @ts-expect-error - Can't quite get these types
				(key: string | symbol) => Schema.check(template[key], x[key]),
				// @ts-expect-error - Can't quite get these types
				(key) => messages.invalidProperty(key, template[key] as Schema<unknown>),
			);

			return (
				$anyobject.check(x) &&
				(Reflect.ownKeys(x).forEach(reportUnknown), resolveUnknown()) &&
				(Reflect.ownKeys(template).forEach(reportKnown), resolveKnown())
			);
		},
		{
			displayName: `{|${Reflect.ownKeys(template)
				// @ts-expect-error - Can't quite get these types
				.map((key) => [key, template[key]] as const)
				.map(toDisplayKeyValue)
				.join(", ")}|}`,
		},
	);
}
