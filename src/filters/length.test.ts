/// <reference types="jest" />
import { hasLength, is, minLength, maxLength, nonEmpty, $any, $Array, $string } from "../index";

const $nonEmptyArray = $Array($any).that(nonEmpty);
const $nonEmptyString = $string.that(nonEmpty);

test("nonEmpty", () => {
	expect(is([], $nonEmptyArray)).toBe(false);
	expect(is(["hello"], $nonEmptyArray)).toBe(true);

	expect(is("", $nonEmptyString)).toBe(false);
	expect(is("hello", $nonEmptyString)).toBe(true);
});

const $hasLengthTwelve = $string.that(hasLength(12));

test("hasLength", () => {
	expect(is("hello frien", $hasLengthTwelve)).toBe(false);
	expect(is("hello friend", $hasLengthTwelve)).toBe(true);
	expect(is("hello friend!", $hasLengthTwelve)).toBe(false);
});

const $hasAtLeastTwo = $Array($any).that(minLength(2));

test("minLength", () => {
	expect(is([0], $hasAtLeastTwo)).toBe(false);
	expect(is([0, 1], $hasAtLeastTwo)).toBe(true);
	expect(is([0, 1, 2], $hasAtLeastTwo)).toBe(true);
});

const $hasAtMostTwo = $Array($any).that(maxLength(2));

test("maxLength", () => {
	expect(is([0], $hasAtMostTwo)).toBe(true);
	expect(is([0, 1], $hasAtMostTwo)).toBe(true);
	expect(is([0, 1, 2], $hasAtMostTwo)).toBe(false);
});
