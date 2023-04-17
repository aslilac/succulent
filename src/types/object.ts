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

/**
 * Matches any non-primitive, non-null, non-undefined, value. Equivalent to `object` in TypeScript.
 * @example
 * ```ts
 * guard({}, $object); // ok
 * guard({ a: 1, b: 2 }, $object); // ok
 * guard(1, $object); // will throw a `TypeError`, because `1` is a `number`
 * guard(new Date(), $object); // ok
 * guard(null, $object); // will throw a `TypeError`, because `null` is not an object
 * ```
 */
export const $object = new Schema(
	(x: unknown): x is object => typeof x === "object" && x != null,
	{ displayName: "object" },
);

/**
 * @param template an object with the same keys that a valid object should have, whose
 * values should be schemas which correspond to the values of a valid object.
 * @example
 * ```ts
 * guard({}, $interface({})); // ok
 * guard({ a: 1 }, $interface({ a: $number })); // ok
 * guard({ a: 1, b: 2 }, $interface({ a: $number })); // ok
 * guard({ a: 1 }, $interface({ a: $number, b: $number })); // throw a `TypeError`, because `b` is missing
 * guard({ a: 1, b: 2 }, $interface({ a: $number, b: $number })); // ok
 * ```
 */
export function $interface<const T extends object>(template: {
	[K in keyof T]: SchemaBase<T[K]>;
}): Schema<T> {
	const keys = Reflect.ownKeys(template);
	const shape = Object.fromEntries(
		keys.map((key) => [key, Schema.from(template[key as keyof T])]),
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

/**
 * The same as `$interface`, but will reject any object which has properties that are
 * unspecified by the template.
 * @param template an object with the same keys that a valid object should have, whose
 * values should be schemas which correspond to the values of a valid object.
 * @example
 * ```ts
 * guard({ a: 1, b: 2 }, $Exact({ a: $number })); // throws a `TypeError`; property `b` is not allowed by the schema
 *
 * // These behave the same as if we used `$inferface`
 * guard({}, $Exact({})); // ok
 * guard({ a: 1 }, $Exact({ a: $number })); // ok
 * guard({ a: 1 }, $Exact({ a: $number, b: $number })); // throw a `TypeError`, because `b` is missing
 * guard({ a: 1, b: 2 }, $Exact({ a: $number, b: $number })); // ok
 * ```
 */
export function $Exact<const T extends object>(template: {
	[K in keyof T]: SchemaBase<T[K]>;
}): Schema<T> {
	const keys = Reflect.ownKeys(template);
	const shape = Object.fromEntries(
		keys.map((key) => [key, Schema.from(template[key as keyof T])]),
	);

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
