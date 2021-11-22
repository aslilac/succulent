import { assertType } from "../_util";
import { is } from "../operators";
import { $boolean, $literal, $NaN, $null, $undefined } from "./constants";
import { $object } from "./object";

test("$boolean", () => {
	expect(is(true, $boolean)).toBe(true);
	expect(is(false, $boolean)).toBe(true);

	expect(is(0, $boolean)).toBe(false);
	expect(is(null, $boolean)).toBe(false);
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

test("$NaN", () => {
	expect(is(NaN, $NaN)).toBe(true);
	expect(is(0, $NaN)).toBe(false);
});

test("$null", () => {
	expect(is(null, $null)).toBe(true);
	expect(is(undefined, $null)).toBe(false);
});

test("$undefined", () => {
	expect(is(undefined, $undefined)).toBe(true);
	expect(is(null, $undefined)).toBe(false);
});
