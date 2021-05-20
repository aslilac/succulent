// Truthy is intentionally absent from this set because nearly anything can be truthy,
// which is not very useful for type narrowing.
// XXX: Notably missing is (typeof NaN), which can't be included because it just evaluates to number
type Falsy = false | 0 | 0n | "" | Nullish;
type Nullish = undefined | null;

export function $falsy(x: unknown): x is Falsy {
	return !x;
}

export function $nullish(x: unknown): x is Nullish {
	return x == null;
}
