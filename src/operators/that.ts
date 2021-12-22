import { Schema } from "../schema";
import { is } from "./is";

type Filter<T> = (x: T) => boolean;

export function that<T>(schema: Schema<T>, ...filters: Array<Filter<T>>): Schema<T> {
	return new Schema(
		(x: unknown): x is T => is(x, schema) && filters.every((filter) => filter(x)),
	);
}
