import { Schema } from "../schema.js";

export const $symbol = new Schema((x: unknown): x is symbol => typeof x === "symbol", {
	displayName: "symbol",
});
