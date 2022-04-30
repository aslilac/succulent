/// <reference types="jest" />

import { assertType } from "../_util";
import {
	a,
	createErrorRef,
	is,
	union,
	$Date,
	$Error,
	$falsy,
	$instanceof,
	$literal,
	$maybe,
	$nullish,
	$object,
	$optional,
	$RegExp,
	$string,
	$URL,
} from "../index";

test("$falsy", () => {
	expect(is(false, $falsy)).toBe(true);
	expect(is(0, $falsy)).toBe(true);
	expect(is(0n, $falsy)).toBe(true);
	expect(is(undefined, $falsy)).toBe(true);
	expect(is(null, $falsy)).toBe(true);
	expect(is(NaN, $falsy)).toBe(true);
	expect(is("", $falsy)).toBe(true);

	expect(is(true, $falsy)).toBe(false);
	expect(is(1, $falsy)).toBe(false);
	expect(is(1n, $falsy)).toBe(false);
	expect(is("hi", $falsy)).toBe(false);
	expect(is([], $falsy)).toBe(false);
	expect(is({}, $falsy)).toBe(false);
});

test("$instanceof", () => {
	class Puppy {}
	const puppy = new Puppy();

	expect(is(puppy, a(Puppy))).toBe(true);
	expect(is(puppy, $instanceof(Puppy))).toBe(true);
	expect(is(Object.create(Puppy.prototype), $instanceof(Puppy))).toBe(true);

	expect(is({}, $instanceof(Puppy))).toBe(false);
	expect(is(Object.create(null), $instanceof(Puppy))).toBe(false);
	expect(is(Puppy, $instanceof(Puppy))).toBe(false);

	function _(x: unknown) {
		if (is(x, $instanceof(Puppy))) assertType<Puppy, typeof x>(x);
	}
});

test("$Date", () => {
	expect(is(new Date(), $Date)).toBe(true);
	expect(is(Date.now(), $Date)).toBe(false);
});

test("$Error", () => {
	expect(is(new Error(), $Error)).toBe(true);
	expect(is(new TypeError(), $Error)).toBe(true);

	function _(x: TypeError) {
		if (is(x, $Error)) {
			// I feel like this shouldn't work? We end up losing specificity here,
			// because x becomes `Error` instead of `TypeError`, but in this specific
			// case they're duck-typed together, so it doesn't make a difference.
			assertType<TypeError, typeof x>(x);
			assertType<typeof x, TypeError>(x);
		}
	}
});

test("$RegExp", () => {
	expect(is(/hi/, $RegExp)).toBe(true);
	expect(is("hi", $RegExp)).toBe(false);
});

test("$URL", () => {
	expect(is(new URL("/", "https://mckayla.dev"), $URL)).toBe(true);
	expect(is("https://mckayla.dev", $URL)).toBe(false);
});

test("$literal", () => {
	const kind = $literal("kind");
	expect(is("kind", kind)).toBe(true);
	expect(is("mean", kind)).toBe(false);

	const zero = $literal(0);
	expect(is(0, zero)).toBe(true);
	expect(is(1, zero)).toBe(false);

	expect(is(null, union(null, undefined))).toBe(true);
	expect(is(undefined, union(null, undefined))).toBe(true);
	expect(is(false, union(null, undefined))).toBe(false);

	function _(x: unknown) {
		if (is(x, $object({ kind }))) {
			assertType<{ kind: "kind" }, typeof x>(x);

			// @ts-expect-error - Types should be incompatible
			assertType<{ kind: "kin" }, typeof x>(x);
		}
	}
});

test("$maybe", () => {
	expect(is(undefined, $maybe($string))).toBe(true);
	expect(is(null, $maybe($string))).toBe(true);
	expect(is("hi", $maybe($string))).toBe(true);

	const ref = createErrorRef();
	expect(is(false, $maybe($string), ref)).toBe(false);
	expect(ref.error).toMatchSnapshot();
});

test("$nullish", () => {
	expect(is(undefined, $nullish)).toBe(true);
	expect(is(null, $nullish)).toBe(true);
	expect(is({}, $nullish)).toBe(false);
});

test("$optional", () => {
	expect(is(undefined, $optional($string))).toBe(true);
	expect(is(null, $optional($string))).toBe(false);
	expect(is("hi", $optional($string))).toBe(true);

	const ref = createErrorRef();
	expect(is(false, $optional($string), ref)).toBe(false);
	expect(ref.error).toMatchSnapshot();
});
