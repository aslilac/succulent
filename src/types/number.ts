import { Schema } from "../schema.js";

/**
 * Checks if the value is a primitive `number`.
 * @example
 * ```ts
 * guard(1, $number); // ok!
 * guard(1n, $number); // will throw a `TypeError`
 * guard("1", $number); // will throw a `TypeError`
 * ```
 */
export const $number = new Schema(
	(x: unknown): x is number => typeof x === "number" && x === x,
	{ displayName: "number" },
);

/**
 * @example
 * ```ts
 * guard(1, $int); // ok!
 * guard(1.0, $int); // ok! (because `float` isn't really a type in JavaScript)
 * guard(1.1, $int); // will throw a `TypeError`
 * ```
 */
export const $int = new Schema((x: unknown): x is number => Number.isInteger(x), {
	displayName: "int",
});

/**
 * @example
 * ```ts
 * guard(1, $finite); // ok!
 * guard(2**128, $finite); // ok!
 * guard(1n, $finite); // will throw a `TypeError`, because `bigint` isn't a `number`
 * guard(Infinity, $finite); // will throw a `TypeError`, for more obvious reasons
 * guard(Number.NEGATIVE_INFINITY, $finite); // also throws a `TypeError`
 * ```
 */
export const $finite = new Schema((x: unknown): x is number => Number.isFinite(x), {
	displayName: "finite",
});

/**
 * @example
 * ```ts
 * guard(1n, $bigint); // ok!
 * guard(1, $bigint); // will throw a `TypeError`
 * ```
 */
export const $bigint = new Schema((x: unknown): x is bigint => typeof x === "bigint", {
	displayName: "bigint",
});
