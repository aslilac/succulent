import { Schema } from "../schema";

export const $number = new Schema(
	(x: unknown): x is number => typeof x === "number" && x === x,
);

export const $int = new Schema((x: unknown): x is number => Number.isInteger(x));

export const $finite = new Schema((x: unknown): x is number => Number.isFinite(x));
