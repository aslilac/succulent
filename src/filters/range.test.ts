/// <reference types="jest" />
import { inRange, is, $number } from "../index";

const $rating = $number.that(inRange(1, 5));

test("inRange", () => {
	expect(is(0, $rating)).toBe(false);
	expect(is(1, $rating)).toBe(true);
	expect(is(5, $rating)).toBe(true);
	expect(is(6, $rating)).toBe(false);
});
