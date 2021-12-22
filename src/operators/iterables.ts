import { Schema } from "../schema";

export function oneOf<T>(x: Iterable<T>): Schema<T> {
	return new Schema((t: unknown): t is T => {
		for (const value of x) {
			if (Object.is(t, value)) {
				return true;
			}
		}

		return false;
	});
}
