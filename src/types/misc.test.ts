import { assertType } from "../_util";
import { is, union } from "../operators";
import { $falsy, $instanceof, $literal, $nullish } from "./misc";
import { $object } from "./object";

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

	expect(is(puppy, $instanceof(Puppy))).toBe(true);
	expect(is(Object.create(Puppy.prototype), $instanceof(Puppy))).toBe(true);

	expect(is({}, $instanceof(Puppy))).toBe(false);
	expect(is(Object.create(null), $instanceof(Puppy))).toBe(false);
	expect(is(Puppy, $instanceof(Puppy))).toBe(false);

	function _(x: unknown) {
		if (is(x, $instanceof(Puppy))) assertType<Puppy, typeof x>(x);
	}
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

test("$nullish", () => {
	expect(is(undefined, $nullish)).toBe(true);
	expect(is(null, $nullish)).toBe(true);
	expect(is({}, $nullish)).toBe(false);
});
