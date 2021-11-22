// import { $literal } from "./types/misc";

export namespace TSchema {
	export type Unwrap<X> = X extends Schema<infer T> ? T : never;
	export type UnwrapAll<X> = { [K in keyof X]: Unwrap<X[K]> };
	export type Wrap<X> = SchemaBase<X>;
	export type WrapAll<X> = { [K in keyof X]: Wrap<X[K]> };
}

export type SchemaBase<T> = Schema<T> | (T extends LiteralSchema ? T : never);
export type LiteralSchema = string | number;

export class Schema<T> {
	static check<T>(base: SchemaBase<T>, x: unknown): x is T {
		if (base instanceof Schema) {
			return base.check(x);
		}

		return new Schema(base).check(x);
	}

	static every<T>(
		base: SchemaBase<T>,
		predicate: (value: T, index: number, array: T[]) => boolean,
	): boolean {
		return Array.from(Schema.from(base)).every(predicate);
	}

	static from<T>(base: SchemaBase<T>): Schema<T> {
		if (base instanceof Schema) {
			return base;
		}

		return new Schema(base);
	}

	/**
	 * A method used to check if a given value matches the schema
	 */
	check: (x: unknown) => x is T;

	/**
	 * Used to iterate through all possible values accepted by the schema,
	 * for certain finite types
	 */
	[Symbol.iterator]: () => Iterator<T> = function* () {};

	constructor(
		base: ((x: unknown) => x is T) | SchemaBase<T>,
		iter?: () => Iterator<T>,
	) {
		// Constructing a Schema from a previous Schema, just copy
		if (base instanceof Schema) {
			this.check = base.check;
			this[Symbol.iterator] = iter ?? base[Symbol.iterator];
			return;
		}

		// Constructing a Schema from a FunctionSchema
		else if (typeof base === "function") {
			this.check = base;
			if (iter) this[Symbol.iterator] = iter;
			return;
		}

		// Constructing a Schema from a LiteralSchema
		this.check = (x: unknown): x is T => Object.is(x, base);
		this[Symbol.iterator] =
			iter ??
			function* () {
				yield base;
			};
	}
}
