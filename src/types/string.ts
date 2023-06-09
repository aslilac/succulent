import { Schema } from "../schema.js";

/**
 * Checks if the value is a primitive `string`.
 * @param x The value to check
 */
export const $string = new Schema((x: unknown): x is string => typeof x === "string", {
	displayName: "string",
});
