import { LiteralSchema, Schema } from "../schema";

// Truthy is intentionally absent from this set because nearly anything can be truthy,
// which is not very useful for type narrowing.

// Notably missing is (typeof NaN), which can't be included because it just
// evaluates to number, and the vast majority of numbers are not falsy
type Falsy = false | 0 | 0n | "" | Nullish;
export const $falsy = new Schema((x: unknown): x is Falsy => !x);

type Nullish = undefined | null;
export const $nullish = new Schema((x: unknown): x is Nullish => x == null);

// eslint-disable-next-line @typescript-eslint/ban-types
export function $instanceof<T extends Function>(t: T) {
	return new Schema((x: unknown): x is T["prototype"] => x instanceof t);
}

export function $literal<T extends LiteralSchema>(t: T) {
	// @ts-expect-error - This should be fine, because LiteralSchema is a
	// valid type to pass, but TypeScript is unhappy
	return new Schema(t);
}
