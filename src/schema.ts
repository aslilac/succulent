import { messages, toDisplayString, trace } from "./base/index.js";

export type Type<X> = Schema.Unwrap<X>;
export namespace Schema {
	export type Unwrap<X> = X extends Schema<infer T> ? T : never;
	export type UnwrapAll<X> = { [K in keyof X]: Unwrap<X[K]> };
	export type Wrap<X> = SchemaBase<X>;
	export type WrapAll<X> = { [K in keyof X]: Wrap<X[K]> };
}

export type SchemaBase<T> = Schema<T> | (T extends LiteralSchema ? T : never);
export type LiteralSchema =
	| string
	| number
	| bigint
	| symbol
	| boolean
	| null
	| undefined;

type Filter<T> = (x: T) => boolean;

interface SchemaOptions<T> {
	displayName?: string;
	iter?: () => Iterator<T>;
}

export class Schema<T> {
	static check<T>(base: SchemaBase<T>, x: unknown): x is T {
		if (base instanceof Schema) {
			return base.check(x);
		}

		return new Schema(base).check(x);
	}

	static is<T>(base: SchemaBase<T>, x: unknown): x is T {
		try {
			Schema.check(base, x);
			return true;
		} catch (error) {
			return false;
		}
	}

	static displayName<T>(base: SchemaBase<T>) {
		return Schema.from(base).displayName;
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
	 * Used to iterate through all possible values accepted by the schema,
	 * for certain finite types
	 */
	readonly [Symbol.iterator]: () => Iterator<T> = function* () {};

	private readonly _check: (x: unknown) => x is T;

	public readonly displayName: string = "(unknown)";

	constructor(
		base: ((x: unknown) => x is T) | SchemaBase<T>,
		options: SchemaOptions<T> = {},
	) {
		const { displayName, iter } = options;

		// Constructing a Schema from a previous Schema, just copy
		if (base instanceof Schema) {
			this._check = base._check;
			this.displayName = displayName || base.displayName;
			this[Symbol.iterator] = iter ?? base[Symbol.iterator];
			return;
		}

		// Constructing a Schema from a FunctionSchema
		if (typeof base === "function") {
			this._check = base;
			if (displayName) this.displayName = displayName;
			if (iter) this[Symbol.iterator] = iter;
			return;
		}

		// Constructing a Schema from a LiteralSchema
		this._check = (x: unknown): x is T => Object.is(x, base);
		this.displayName = displayName || toDisplayString(base);
		this[Symbol.iterator] =
			iter ??
			function* () {
				yield base;
			};
	}

	/**
	 * A method used to check if a given value matches the schema
	 */
	check(x: unknown): x is T {
		let ok;
		try {
			ok = this._check(x);
		} catch (error) {
			throw new TypeError(trace(messages.invalidValue(x, this), error));
		}

		if (!ok) {
			throw new TypeError(messages.invalidValue(x, this));
		}

		return true;
	}

	that(...filters: Array<Filter<T>>): Schema<T> {
		return new Schema(
			(x: unknown): x is T => this.check(x) && filters.every((filter) => filter(x)),
		);
	}

	toString(): string {
		return this.displayName;
	}
}
