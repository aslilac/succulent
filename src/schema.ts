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

	check: (x: unknown) => x is T;

	constructor(base: ((x: unknown) => x is T) | SchemaBase<T>) {
		// Constructing a Schema from a previous Schema, just copy
		if (base instanceof Schema) {
			this.check = base.check;
			return;
		}

		// Constructing a Schema from a FunctionSchema
		else if (typeof base === "function") {
			this.check = base;
			return;
		}

		// Constructing a Schema from a LiteralSchema
		this.check = (x: unknown): x is T => Object.is(x, base);
	}
}
