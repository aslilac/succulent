import { assertType } from "../_util";
import { is, or, union } from "../operators";
import { $boolean, $undefined } from "./constants";
import { $number } from "./number";
import { $exact, $object } from "./object";
import { $string } from "./string";
import { $tuple } from "./tuple";

test("$object", () => {
	// The type signature of Symbol.for isn't quite correct, so we have to
	// assign the symbol we use here as a constant even though the whole point
	// of Symbol.for is to return the same symbol when called with the same
	// string multiple times.
	const key = Symbol("k");

	const example = $object({
		a: $boolean,
		b: $number,
		c: $string,
		d: $object({
			[key]: $tuple($number, $number, $number, $number),
			key: $tuple($number, $number, $number, $number),
		}),
	});

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

	expect(is(i, example)).toBe(false);
	expect(is(j, example)).toBe(false);
	expect(is(k, example)).toBe(false);
	expect(is(l, example)).toBe(true);

	type Example = { a: boolean; b: number; c: string; d: ExampleD };
	type ExampleD = { [key]: Numbers; key: Numbers };
	type Numbers = [number, number, number, number];
	function _(x: unknown) {
		if (is(x, example)) assertType<Example, typeof x>(x);
	}
});

test("$object with unwrapped literals", () => {
	expect(is({ hi: "hi" }, $object({ hi: "hi" }))).toBe(true);
	expect(is({ hi: "hi" }, $object({ hi: "hey" }))).toBe(false);
});

test("$object with optional keys", () => {
	// I think exactOptionalPropertyTypes would actually make this fail, but
	// I'm not sure what the solution would be if so.
	type Test = { hi: string; optional?: string };
	const schema = $object({ hi: $string, optional: union($string, $undefined) });

	expect(is({ hi: "hi" }, schema)).toBe(true);

	function _(x: unknown) {
		if (is(x, schema)) assertType<Test, typeof x>(x);
	}
});

test("Using $object to match an existing type", () => {
	type Friend = { name: string };

	// Validates that the object has a key of name with type string
	is<Friend>({}, $object({ name: $string }));

	// @ts-expect-error - Doesn't have name!
	is<Friend>({}, $object({ count: $number }));

	// Extra properties are fine
	is<Friend>({}, $object({ name: $string, count: $number }));

	// @ts-expect-error - string | undefined is not assignable to type string
	is<Friend>({}, $object({ name: or($undefined, $string) }));

	// This one works fine, because we're using Partial<Friend> instead of Friend
	is<Partial<Friend>>({}, $object({ name: or($undefined, $string) }));
});

test("$exact", () => {
	const schema = $exact({ a: $boolean, b: $boolean, c: $boolean });

	expect(is({ a: true, b: true }, schema)).toBe(false);
	expect(is({ a: true, b: true, c: true }, schema)).toBe(true);
	expect(is({ a: true, b: true, c: true, d: true }, schema)).toBe(false);
	expect(is({ b: true, c: true, d: true }, schema)).toBe(false);
});
