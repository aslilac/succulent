import { Schema } from "../schema";

export const $number = new Schema(
	(x: unknown): x is number => typeof x === "number" && x === x,
	{ displayName: "number" },
);

export const $int = new Schema((x: unknown): x is number => Number.isInteger(x), {
	displayName: "int",
});
export const $finite = new Schema((x: unknown): x is number => Number.isFinite(x));

export const $bigint = new Schema((x: unknown): x is bigint => typeof x === "bigint", {
	displayName: "bigint",
});
