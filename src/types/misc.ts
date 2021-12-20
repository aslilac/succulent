import { LiteralSchema, Schema } from "../schema";
import { union } from "../operators";

// eslint-disable-next-line @typescript-eslint/ban-types
export function $instanceof<T extends Function>(t: T) {
	return new Schema((x: unknown): x is T["prototype"] => x instanceof t);
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

export const $falsy = new Schema((x: unknown): x is falsy => !x);
export const $nullish = new Schema((x: unknown): x is nullish => x == null);

export function $optional<T>(schema: Schema<T>): Schema<T | undefined> {
	return union(schema, undefined);
}

export function $maybe<T>(schema: Schema<T>): Schema<T | nullish> {
	return union(schema, $nullish);
}

export const $date = $instanceof(Date);
export const $error = $instanceof(Error);
export const $regexp = $instanceof(RegExp);
export const $url = $instanceof(URL);

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
