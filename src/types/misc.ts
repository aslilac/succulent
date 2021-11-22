import { Schema } from "../schema";

// Truthy is intentionally absent from this set because nearly anything can be truthy,
// which is not very useful for type narrowing.

// XXX: Notably missing is (typeof NaN), which can't be included because it
// just evaluates to number, and the vast majority of numbers are not falsy
type Falsy = false | 0 | 0n | "" | Nullish;
export const $falsy = new Schema((x: unknown): x is Falsy => !x);

type Nullish = undefined | null;
export const $nullish = new Schema((x: unknown): x is Nullish => x == null);

export function $instanceof<T extends Function>(t: T) {
	return new Schema((x: unknown): x is T["prototype"] => x instanceof t);
}

export function $literal<T extends string | number>(t: T) {
	return new Schema((x: unknown): x is T => Object.is(x, t));
}
