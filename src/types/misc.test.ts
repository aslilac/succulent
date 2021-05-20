import { is } from "../operators";
import { $falsy, $nullish } from "./misc";

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

test("$nullish", () => {
	expect(is(undefined, $nullish)).toBe(true);
	expect(is(null, $nullish)).toBe(true);
	expect(is({}, $nullish)).toBe(false);
});
