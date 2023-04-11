import { KeyReporter, messages, toDisplayKey } from "../base";
import { Schema, SchemaBase } from "../schema";

const hasOwn = {}.hasOwnProperty;

function assertHasOwn(target: unknown, prop: string | symbol) {
	if (!hasOwn.call(target, prop)) {
		throw null;
	}

	return true;
}

type KeyValuePair = readonly [key: unknown, valueSchema: SchemaBase<unknown>];
const toDisplayKeyValue = ([key, valueSchema]: KeyValuePair) =>
	`${toDisplayKey(key)}: ${Schema.displayName(valueSchema)}`;

export const $object = new Schema(
	(x: unknown): x is object => typeof x === "object" && x != null,
	{ displayName: "object" },
);

export function $interface<const T extends object>(template: {
	[K in keyof T]: SchemaBase<T[K]>;
}): Schema<T> {
	const keys = Reflect.ownKeys(template);
	const shape = Object.fromEntries(keys.map((key) => [key, Schema.from(template[key as keyof T])]));

	const known = new KeyReporter(
		// @ts-expect-error - Can't quite get these types
		(key: string | symbol, value: unknown) => shape[key].check(value),
		// @ts-expect-error - Can't quite get these types
		(key, value) => messages.invalidProperty(key, shape[key] as Schema<unknown>),
	);

	return new Schema(
		(x: unknown): x is T => {
			if (!$object.check(x)) {
				return false;
			}

			known.reset();
			for (const key of keys) {
				// @ts-expect-error - `x` is just `object` still, not enough to index
				known.report(key, x[key as keyof T]);
			}
			known.resolve();

			return true;
		},
		{
			displayName: `{${keys
				// @ts-expect-error - Can't quite get these types
				.map((key) => [key, template[key]] as const)
				.map(toDisplayKeyValue)
				.join(", ")}}`,
		},
	);
}

export function $Exact<const T extends object>(template: {
	[K in keyof T]: SchemaBase<T[K]>;
}): Schema<T> {
	const keys = Reflect.ownKeys(template);
	const shape = Object.fromEntries(keys.map((key) => [key, Schema.from(template[key as keyof T])]));

	const unknown = new KeyReporter(
		(key: string | symbol) => assertHasOwn(template, key),
		(key) => `Unexpected property ${toDisplayKey(key)}`,
	);

	const known = new KeyReporter(
		// @ts-expect-error - Can't quite get these types
		(key: string | symbol, value: unknown) => shape[key].check(value),
		// @ts-expect-error - Can't quite get these types
		(key, value) => messages.invalidProperty(key, shape[key] as Schema<unknown>),
	);

	return new Schema(
		(x: unknown): x is T => {
			if (!$object.check(x)) {
				return false;
			}

			unknown.reset();
			for (const key of Reflect.ownKeys(x)) {
				unknown.report(key);
			}
			unknown.resolve();

			known.reset();
			for (const key of keys) {
				// @ts-expect-error - `x` is just `object` still, not enough to index
				known.report(key, x[key as keyof T]);
			}
			known.resolve();

			return true;
		},
		{
			displayName: `{|${keys
				// @ts-expect-error - Can't quite get these types
				.map((key) => [key, template[key]] as const)
				.map(toDisplayKeyValue)
				.join(", ")}|}`,
		},
	);
}
