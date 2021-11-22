import { Schema } from "../schema";

export const $string = new Schema((x: unknown): x is string => typeof x === "string");
