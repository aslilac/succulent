import { assertType } from "../_util";
import { is } from "../operators";
import { $falsy, $literal, $nullish } from "./misc";
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

test("$literal", () => {
	const kind = $literal("kind");
	expect(is("kind", kind)).toBe(true);
	expect(is("mean", kind)).toBe(false);

	const zero = $literal(0);
	expect(is(0, zero)).toBe(true);
	expect(is(1, zero)).toBe(false);

	function _(x: unknown) {
		if (is(x, $object({ kind }))) {
			assertType<{ kind: "kind" }, typeof x>(x);

			// @ts-expect-error
			assertType<{ kind: "kin" }, typeof x>(x);
		}
	}
});

test("$nullish", () => {
	expect(is(undefined, $nullish)).toBe(true);
	expect(is(null, $nullish)).toBe(true);
	expect(is({}, $nullish)).toBe(false);
});
