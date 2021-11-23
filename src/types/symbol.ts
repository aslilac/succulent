import { Schema } from "../schema";

export const $symbol = new Schema((x: unknown): x is symbol => typeof x === "symbol");
