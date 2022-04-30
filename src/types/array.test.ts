/// <reference types="jest" />

import { check, is, $array, $number, $object, $string, $undefined } from "../index";

test("$array", () => {
	const numArray = $array($number);
	expect(is([], numArray)).toBe(true);
	expect(is([1], numArray)).toBe(true);
	expect(is([1, 2, 3, 4, 5], numArray)).toBe(true);
	expect(is([1, 2, 3, 4, 5, undefined], numArray)).toBe(false);

	expect(() =>
		check([1, 2, 3, 4, 5, undefined], numArray),
	).toThrowErrorMatchingSnapshot();

	const undefinedArray = $array($undefined);
	expect(is(new Array(100), undefinedArray)).toBe(true);
	expect(is(new Array(100), numArray)).toBe(false);

	const $Thing = $object({ name: $string, count: $number });

	expect(() => check(false, $array($Thing))).toThrowErrorMatchingSnapshot();
	expect(() => check([false], $array($Thing))).toThrowErrorMatchingSnapshot();
});
