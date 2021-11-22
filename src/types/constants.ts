import { Schema } from "../schema";

export const $boolean = new Schema((x: unknown): x is boolean => typeof x === "boolean");
export const $false = new Schema((x: unknown): x is false => x === false);
export const $true = new Schema((x: unknown): x is true => x === true);

// Not sure why, but the type here isn't inferred correctly
export const $undefined = new Schema<undefined>(
	(x: unknown): x is undefined => x === undefined,
);

export const $null = new Schema((x: unknown): x is null => x === null);

export const $NaN = new Schema((x: unknown): x is typeof NaN => x !== x);
