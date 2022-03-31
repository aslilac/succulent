/// <reference types="jest" />

import { is, $array, $number, $undefined } from "../index";

test("$array", () => {
	const numArray = $array($number);
	expect(is([], numArray)).toBe(true);
	expect(is([1], numArray)).toBe(true);
	expect(is([1, 2, 3, 4, 5], numArray)).toBe(true);
	expect(is([1, 2, 3, 4, 5, undefined], numArray)).toBe(false);

	const undefinedArray = $array($undefined);
	expect(is(new Array(100), undefinedArray)).toBe(true);
	expect(is(new Array(100), numArray)).toBe(false);
});
