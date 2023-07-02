import { LiteralSchema, Schema, SchemaBase } from "../schema.js";
import { $undefined } from "./constants.js";

export function $instanceof<T extends Function>(t: T) {
	return new Schema((x: unknown): x is T["prototype"] => x instanceof t, {
		displayName: t.name,
	});
}

/**
 * @internalRemarks
 * Like `instanceof`, but for constructors that might not actually be defined, such as
 * `Blob` or `File`. If the type `T` is not available in the current environment, the
 * returned schema will be an alias of `$never`.
 */
export function $tryinstanceof<T extends Function>(mapT: () => T) {
	try {
		const t = mapT();
		if (!t) {
			return $never;
		}
		return $instanceof(t);
	} catch {
		return $never;
	}
}

/**
 * Alias for $instanceof, i.e. checks if a value is "a"/an `T`
 */
export const a = $instanceof;

/**
 * Checks for equality with `Object.is`.
 * @example
 * ```ts
 * guard(1, $literal(1)); // ok
 * guard(2, $literal(1)); // throws a `TypeError` because `1 !== 2`
 * guard("hello", $literal("hello")); // ok
 * guard("hey", $literal("hello")); // throws a `TypeError` because `"hey" !== "hello"`
 * ```
 */
export function $literal<T extends LiteralSchema>(t: T) {
	// @ts-expect-error - This should be fine, because LiteralSchema is a
	// valid type to pass, but TypeScript is unhappy
	return new Schema(t);
}

export type nullish = undefined | null;
/**
 * Matches `null` or `undefined`.
 * @example
 * ```ts
 * guard(undefined, $nullish); // ok
 * guard(null, $nullish); // ok
 * guard(0, $nullish); // throws a `TypeError` because `0` is not `null` or `undefined`
 * ```
 */
export const $nullish = new Schema((x: unknown): x is nullish => x == null, {
	displayName: "nullish",
});

/**
 * @internalRemarks
 * Notably missing is (typeof NaN), which can't be included because it just
 * evaluates to `number`, and the vast majority of numbers are not falsy
 */
export type falsy = false | 0 | 0n | "" | nullish;
/**
 * @example
 * ```ts
 */
export const $falsy = new Schema((x: unknown): x is falsy => !x, {
	displayName: "falsy",
});

// Truthy is intentionally absent because nearly anything can be truthy, which is not
// very useful for type narrowing.

/**
 * Alias for `union($T, undefined)` (with a prettier display name).
 * @example
 * ```ts
 * guard(undefined, $optional($string)); // ok
 * guard("hello, computer!", $optional($string)); // ok
 * guard(0, $optional($string)); // throws a `TypeError` because `0` is not a string
 * ```
 */
export function $optional<T>(base: SchemaBase<T>): Schema<T | undefined> {
	const schema = Schema.from(base);

	return new Schema(
		(x: unknown): x is T | undefined =>
			Schema.is(schema, x) || Schema.is($undefined, x),
		{ displayName: `${schema.displayName}?` },
	);
}

/**
 * Alias for `union($T, null, undefined)` (with a prettier display name).
 * @example
 * ```ts
 * guard(undefined, $optional($string)); // ok
 * guard("hello, computer!", $optional($string)); // ok
 * guard(0, $optional($string)); // throws a `TypeError` because `0` is not a string
 * ```
 */
export function $maybe<T>(base: SchemaBase<T>): Schema<T | nullish> {
	const schema = Schema.from(base);

	return new Schema(
		(x: unknown): x is T | undefined =>
			Schema.is(schema, x) || Schema.is($nullish, x),
		{ displayName: `maybe ${schema.displayName}` },
	);
}

/**
 * As the name suggests, any value passed will be valid, even values you might really not
 * expect, like functions.
 * @remarks
 * Probably shouldn't be used very frequently, but occasionally useful for
 * stuff like `$array($any)` or just specifying that an object should have a
 * key, without needing to specify the whole type. Basically the same kind of
 * cases you might want to use it for in TypeScript.
 * @example
 * ```ts
 * guard(undefined, $any); // ok
 * guard(null, $any); // ok
 * guard(1, $any); // ok
 * guard("hello", $any); // ok
 * guard({}, $any); // ok
 * guard([], $any); // ok
 * guard(Symbol(), $any); // ok
 * guard(() => {}, $any); // ok
 * guard(class {}, $any); // ok
 * guard(new Date(), $any); // ok
 * guard(/friend/, $any); // ok
 * // ...you get the point
 * ```
 */
export const $any = new Schema((x: unknown): x is any => true, { displayName: "any" });

/**
 * The opposite of `$any`, this schema will never match anything.
 * @remarks
 * Mostly useful for tests to convey that something should never match.
 * @example
 * ```ts
 * guard(undefined, $never); // throws a `TypeError`
 * guard(null, $never); // throws a `TypeError`
 * guard(1, $never); // throws a `TypeError`
 * guard("hello", $never); // throws a `TypeError`
 * guard({}, $never); // throws a `TypeError`
 * guard([], $never); // throws a `TypeError`
 * guard(Symbol(), $never); // throws a `TypeError`
 * guard(() => {}, $never); // throws a `TypeError`
 * guard(class {}, $never); // throws a `TypeError`
 * guard(new Date(), $never); // throws a `TypeError`
 * guard(/friend/, $never); // throws a `TypeError`
 * // ...you get the point
 * ```
 */
export const $never = new Schema((x: unknown): x is never => false, {
	displayName: "never",
});

// A bunch of type guards for the built-in types. `$tryinstanceof` is used for newer types,
// and types which might only be present in certain environments (like `Buffer`, which is
// not present in the browser). If browsers have commonly had it for at least two years, and
// all supported versions of Node have it, then it should just use `$instanceof`.
export const $Blob = $tryinstanceof(() => Blob);
export const $Buffer = $tryinstanceof(() => Buffer);
export const $Date = $instanceof(Date);
export const $File = $tryinstanceof(() => File);
export const $Error = $instanceof(Error);
export const $RegExp = $instanceof(RegExp);
export const $Request = $tryinstanceof(() => Request);
export const $Response = $tryinstanceof(() => Response);
export const $URL = $instanceof(URL);

/**
 * @remarks
 * One subtle use case for for `$ArrayBuffer` is to ensure that you *actually* have an
 * `ArrayBuffer` object, and not a `Uint8Array` or some other view. A little known fact is
 * that TypeScript will happily let you use a typed array in place of an `ArrayBuffer`,
 * which is almost never what you want.
 * @example
 * ```ts
 * function doSomeMagic(buffer: ArrayBuffer) {
 *   guard(buffer, $ArrayBuffer);
 *   // now you can *actually* be sure that `buffer` is an `ArrayBuffer`
 * }
 * ```
 */
export const $ArrayBuffer = $instanceof(ArrayBuffer);

/**
 * `ArrayBufferView`s are anything that's backed by an `ArrayBuffer`, like a `Uint8Array`
 * or any other typed array.
 * @example
 * ```ts
 * guard(new Uint8Array(), $ArrayBufferView); // ok
 * guard(new ArrayBuffer(), $ArrayBufferView); // throws a `TypeError`, `ArrayBuffer` is not an `ArrayBufferView`
 * ```
 */
export const $ArrayBufferView = new Schema(
	(x: unknown): x is ArrayBufferView => ArrayBuffer.isView(x),
	{ displayName: "ArrayBufferView" },
);

export const $Int8Array = $instanceof(Int8Array);
export const $Int16Array = $instanceof(Int16Array);
export const $Int32Array = $instanceof(Int32Array);
export const $BigInt64Array = $instanceof(BigInt64Array);
export const $Uint8Array = $instanceof(Uint8Array);
export const $Uint8ClampedArray = $instanceof(Uint8ClampedArray);
export const $Uint16Array = $instanceof(Uint16Array);
export const $Uint32Array = $instanceof(Uint32Array);
export const $BigUint64Array = $instanceof(BigUint64Array);
export const $Float32Array = $instanceof(Float32Array);
export const $Float64Array = $instanceof(Float64Array);
