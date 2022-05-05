/// <reference types="jest" />
import { assertType } from "../_util";
import {
	check,
	is,
	or,
	Type,
	union,
	$boolean,
	$Exact,
	$number,
	$interface,
	$string,
	$Tuple,
	$undefined,
} from "../index";

test("$interface", () => {
	// The type signature of Symbol.for isn't quite correct, so we have to
	// assign the symbol we use here as a constant even though the whole point
	// of Symbol.for is to return the same symbol when called with the same
	// string multiple times.
	const key = Symbol("k");

	const $Example = $interface({
		a: $boolean,
		b: $number,
		c: $string,
		d: $interface({
			[key]: $Tuple($number, $number, $number, $number),
			key: $Tuple($number, $number, $number, $number),
		}),
	});

	const h = { a: true, b: 1, c: "hi" };
	const i = { a: true, b: 1, c: "hi", d: {} };
	const j = { ...i, d: { [key]: [0, 0, 0, 0] } };
	const k = { ...i, d: { key: [0, 0, 0, 0] } };

	const l = {
		...i,
		d: {
			[key]: [0, 0, 0, 0],
			key: [0, 0, 0, 0],
		},
	};

	expect(is(h, $Example)).toBe(false);
	expect(is(i, $Example)).toBe(false);
	expect(is(j, $Example)).toBe(false);
	expect(is(k, $Example)).toBe(false);
	expect(is(l, $Example)).toBe(true);

	type Example = { a: boolean; b: number; c: string; d: ExampleD };
	type ExampleD = { [key]: Numbers; key: Numbers };
	type Numbers = [number, number, number, number];

	type TAutoExample = Type<typeof $Example>;
	interface IAutoExample extends Type<typeof $Example> {} // eslint-disable-line @typescript-eslint/no-empty-interface
	function _(x: unknown) {
		if (is(x, $Example)) {
			assertType<Example, typeof x>(x);
			assertType<Example, TAutoExample>(x);
			assertType<Example, IAutoExample>(x);
		}
	}
});

test("$interface with unwrapped literals", () => {
	expect(is({ hi: "hi" }, $interface({ hi: "hi" }))).toBe(true);
	expect(is({ hi: "hi" }, $interface({ hi: "hey" }))).toBe(false);
});

test("$interface with optional keys", () => {
	// I think exactOptionalPropertyTypes would actually make this fail, but
	// I'm not sure what the solution would be if so.
	type Test = { hi: string; optional?: string };
	const schema = $interface({ hi: $string, optional: union($string, $undefined) });

	expect(is({ hi: "hi" }, schema)).toBe(true);

	function _(x: unknown) {
		if (is(x, schema)) assertType<Test, typeof x>(x);
	}
});

test("Using $interface to match an existing type", () => {
	type Friend = { name: string };

	// Validates that the object has a key of name with type string
	is<Friend>({}, $interface({ name: $string }));

	// @ts-expect-error - Doesn't have name!
	is<Friend>({}, $interface({ count: $number }));

	// Extra properties are fine
	is<Friend>({}, $interface({ name: $string, count: $number }));

	// @ts-expect-error - string | undefined is not assignable to type string
	is<Friend>({}, $interface({ name: or($undefined, $string) }));

	// This one works fine, because we're using Partial<Friend> instead of Friend
	is<Partial<Friend>>({}, $interface({ name: or($undefined, $string) }));
});

test("$Exact", () => {
	const schema = $Exact({ a: $boolean, b: $boolean, c: $boolean });

	const smol = { a: true };
	const correct = { a: true, b: true, c: true };
	const big = { a: true, b: true, c: true, d: true, e: true };
	const wrong = { a: true, b: true, d: true };

	expect(() => check(smol, schema)).toThrowErrorMatchingSnapshot();
	expect(() => check(correct, schema)).not.toThrow();
	expect(() => check(big, schema)).toThrowErrorMatchingSnapshot();
	expect(() => check(wrong, schema)).toThrowErrorMatchingSnapshot();

	expect(is(smol, schema)).toBe(false);
	expect(is(correct, schema)).toBe(true);
	expect(is(big, schema)).toBe(false);
	expect(is(wrong, schema)).toBe(false);
});
