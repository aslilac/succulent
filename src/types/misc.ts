import { LiteralSchema, Schema, SchemaBase } from "../schema";
import { $undefined } from "./constants";

// eslint-disable-next-line @typescript-eslint/ban-types
export function $instanceof<T extends Function>(t: T) {
	return new Schema((x: unknown): x is T["prototype"] => x instanceof t, {
		displayName: t.name,
	});
}

/**
 * Alias for $instanceof, i.e. checks if a value is "a"/an `T`
 */
export const a = $instanceof;

export function $literal<T extends LiteralSchema>(t: T) {
	// @ts-expect-error - This should be fine, because LiteralSchema is a
	// valid type to pass, but TypeScript is unhappy
	return new Schema(t);
}

// Truthy is intentionally absent from this set because nearly anything can be truthy,
// which is not very useful for type narrowing.

// Notably missing is (typeof NaN), which can't be included because it just
// evaluates to `number`, and the vast majority of numbers are not falsy
export type falsy = false | 0 | 0n | "" | nullish;
export type nullish = undefined | null;

export const $falsy = new Schema((x: unknown): x is falsy => !x, {
	displayName: "falsy",
});
export const $nullish = new Schema((x: unknown): x is nullish => x == null, {
	displayName: "nullish",
});

export function $optional<T>(base: SchemaBase<T>): Schema<T | undefined> {
	const schema = Schema.from(base);

	return new Schema(
		(x: unknown): x is T | undefined =>
			Schema.is(schema, x) || Schema.is($undefined, x),
		{ displayName: `${schema.displayName}?` },
	);
}

export function $maybe<T>(base: SchemaBase<T>): Schema<T | nullish> {
	const schema = Schema.from(base);

	return new Schema(
		(x: unknown): x is T | undefined =>
			Schema.is(schema, x) || Schema.is($nullish, x),
		{ displayName: `maybe ${schema.displayName}` },
	);
}

/**
 * Probably shouldn't be used very frequently, but occasionally useful for
 * stuff like `$array($any)` or just specifying that an object should have a
 * key, without needing to specify the whole type. Basically the same kind of
 * cases you might want to use it in TypeScript.
 */
export const $any = new Schema((x: unknown): x is any => true, { displayName: "any" }); // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Mostly useful for tests to convey that something should never match, honestly
 * not very useful for anything else imho.
 */
export const $never = new Schema((x: unknown): x is never => false, {
	displayName: "never",
});

// export const $Blob = $instanceof(Blob);
export const $Date = $instanceof(Date);
// export const $File = $instanceof(File);
export const $Error = $instanceof(Error);
export const $RegExp = $instanceof(RegExp);
export const $URL = $instanceof(URL);

export const $ArrayBuffer = $instanceof(ArrayBuffer);
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
