import { Schema } from "../schema";
import { $literal } from "./misc";

/**
 * Checks if the value is a primitive `boolean`; `true` or `false`
 * @example
 * ```ts
 * guard(true, $boolean); // ok
 * guard(false, $boolean); // ok
 * guard(1, $boolean); // will throw a `TypeError`
 * ```
 */
export const $boolean = new Schema((x: unknown): x is boolean => typeof x === "boolean", {
	displayName: "boolean",
	iter: () => [true, false][Symbol.iterator](),
});

/**
 * Checks if the value is `NaN` using `Number.isNaN`
 * @remarks
 * Unlike most other numbers, `NaN` cannot be used as a literal type, so this function
 * can only narrow the type to `number`
 * @internalRemarks
 * There are a couple issues tracking this and other adjacent problems
 * - <https://github.com/microsoft/TypeScript/issues/28682>
 * - <https://github.com/microsoft/TypeScript/issues/32277>
 * - <https://github.com/microsoft/TypeScript/issues/36964>
 * @example
 * ```ts
 * guard(NaN, $NaN); // ok
 * guard(0, $NaN); // throws a `TypeError` because `0` is not `NaN`
 * ```
 */
export const $NaN = new Schema((x: unknown): x is typeof NaN => x !== x, {
	displayName: "NaN",
});

/**
 * Alias for {@link $literal | `$literal(false)`}
 */
export const $false = $literal(false);

/**
 * Alias for {@link $literal | `$literal(true)`}
 */
export const $true = $literal(true);

/**
 * Alias for {@link $literal | `$literal(undefined)`}
 */
export const $undefined = $literal(undefined);

/**
 * Alias for {@link $literal | `$literal(null)`}
 */
export const $null = $literal(null);
