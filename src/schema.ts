import { is } from "./operators";
import { $number } from "./types/number";
import { $string } from "./types/string";

// export interface Schema<T> { (x: unknown): x is T }
// export type Schema<T> = (x: unknown) => x is T;
export type Schema<T> = FunctionSchema<T>; // | (T extends LiteralSchema ? T : never);
// export type LiteralSchema = string | number | boolean | null | undefined;
export type FunctionSchema<T> = (x: unknown) => x is T;

export namespace Schema {
	export type Unwrap<X> = X extends Schema<infer T> ? T : never;
	export type UnwrapAll<X> = { [K in keyof X]: Unwrap<X[K]> };
	// export type Wrap<X> = X extends FunctionSchema<infer T> ? X : Schema<X>;
	export type Wrap<X> = Schema<X>;
	export type WrapAll<X> = { [K in keyof X]: Wrap<X[K]> };
}
