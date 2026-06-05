import { assertType } from "../_util.js";
import {
	check,
	is,
	or,
	type Type,
	union,
	$boolean,
	$Exact,
	$interface,
	$number,
	$optional,
	$string,
	$Tuple,
	$undefined,
} from "../index.js";

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

	expect(() => check(j, $Example)).toThrowErrorMatchingSnapshot();
	expect(() => check(k, $Example)).toThrowErrorMatchingSnapshot();

	type Example = { a: boolean; b: number; c: string; d: ExampleD };
	type ExampleD = { [key]: Numbers; key: Numbers };
	type Numbers = [number, number, number, number];

	type TAutoExample = Type<typeof $Example>;
	interface IAutoExample extends Type<typeof $Example> {}
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
	const $Test = $interface({ hi: $string, there: $optional($string) });
	type Test = Type<typeof $Test>;

	// Asserts that the derived `Test` type allows omitting the `$optional`
	// `there` property from object literals.
	const test: Test = { hi: "hi" };
	expect(is(test, $Test)).toBe(true);
	expect(is({ hi: "hi", optional: "ok" }, $Test)).toBe(true);
	expect(is({ hi: "hi", optional: undefined }, $Test)).toBe(true);
	expect(is({}, $Test)).toBe(false);

	function _(x: unknown) {
		if (is(x, $Test)) assertType<Test, typeof x>(x);
	}
});

// Regression test for https://github.com/aslilac/succulent/issues/13 — an
// `$optional` property combined with an index signature should not force the
// property to be present.
test("$interface optional property + index signature (issue #13)", () => {
	const $Foo = $interface({ url: $optional($string) });
	type Foo = Type<typeof $Foo> & { [index: string]: unknown };

	const data: Foo = { notUrl: "any" };
	expect(is(data, $Foo)).toBe(true);
});

test("Using $interface to match an existing type", () => {
	type Friend = { name: string };

	// Validates that the object has a key of name with type string
	expect(is<Friend>({}, $interface({ name: $string }))).toBe(false);

	// @ts-expect-error - Doesn't have name!
	expect(is<Friend>({}, $interface({ count: $number }))).toBe(false);

	// Extra properties are fine
	expect(is<Friend>({}, $interface({ name: $string, count: $number }))).toBe(
		false,
	);

	// @ts-expect-error - string | undefined is not assignable to type string
	expect(is<Friend>({}, $interface({ name: union($undefined, $string) }))).toBe(
		true,
	);

	// This one works fine, because we're using Partial<Friend> instead of Friend
	expect(
		is<Partial<Friend>>({}, $interface({ name: or($undefined, $string) })),
	).toBe(true);
});

// Regression test for https://github.com/aslilac/succulent/issues/12 — the
// values of unexpected properties should appear in the error message.
test("$Exact reports values of unexpected properties (issue #12)", () => {
	const $A = $Exact({ a: $number });
	try {
		check({ a: 1, b: 2, c: "hello" }, $A);
		throw new Error("expected check to throw");
	} catch (error) {
		const msg = (error as Error).message;
		expect(msg).toContain("Unexpected property b, has value 2");
		expect(msg).toContain('Unexpected property c, has value "hello"');
	}
});

test("$Exact", () => {
	const $State = $Exact({ a: $boolean, b: $boolean, c: $boolean });

	const smol = { a: true };
	const correct = { a: true, b: true, c: true };
	const big = { a: true, b: true, c: true, d: true, e: true };
	const wrong = { a: true, b: true, d: true };

	expect(() => check(smol, $State)).toThrowErrorMatchingSnapshot();
	expect(() => check(correct, $State)).not.toThrow();
	expect(() => check(big, $State)).toThrowErrorMatchingSnapshot();
	expect(() => check(wrong, $State)).toThrowErrorMatchingSnapshot();

	expect(is(smol, $State)).toBe(false);
	expect(is(correct, $State)).toBe(true);
	expect(is(big, $State)).toBe(false);
	expect(is(wrong, $State)).toBe(false);
});

test("`null` prototype", () => {
	const $Friend = $interface({ name: $string });

	const billie = Object.create(null);
	expect(is(billie, $Friend)).toBe(false);

	billie.name = "Billie";
	expect(is(billie, $Friend)).toBe(true);
});
