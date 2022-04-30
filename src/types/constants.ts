import { Schema } from "../schema";
import { $literal } from "./misc";

export const $boolean = new Schema((x: unknown): x is boolean => typeof x === "boolean", {
	displayName: "boolean",
});
export const $NaN = new Schema((x: unknown): x is typeof NaN => x !== x, {
	displayName: "NaN",
});

export const $false = $literal(false);
export const $true = $literal(true);
export const $undefined = $literal(undefined);
export const $null = $literal(null);
