import { is } from "./operators";
import { $number } from "./types/number";
import { $string } from "./types/string";

// export interface Schema<T> { (x: unknown): x is T }
// export type Schema<T> = (x: unknown) => x is T;
export type Schema<T> = (x: unknown) => x is T;
// | T[]
// | (T extends [infer I] ? [I] : never)
// | (T extends string | number | boolean | null | undefined ? T : never);

export namespace Schema {
	export type Unwrap<X> = X extends Schema<infer T> ? T : never;
	export type UnwrapAll<X> = { [K in keyof X]: Unwrap<X[K]> };
	export type Wrap<X> = /*X extends Schema<infer> ? X :*/ Schema<X>;
	export type WrapAll<X> = { [K in keyof X]: Wrap<X[K]> };
}
