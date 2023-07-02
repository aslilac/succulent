/// <reference types="jest" />
import { check, is, $Array, $number, $interface, $string, $undefined } from "../index.js";

test("$Array", () => {
	const numArray = $Array($number);
	expect(is([], numArray)).toBe(true);
	expect(is([1], numArray)).toBe(true);
	expect(is([1, 2, 3, 4, 5], numArray)).toBe(true);
	expect(is([1, 2, 3, 4, 5, undefined], numArray)).toBe(false);

	const undefinedArray = $Array($undefined);
	expect(is(new Array(100), undefinedArray)).toBe(true);
	expect(is(new Array(100), numArray)).toBe(false);

	const $Thing = $interface({ name: $string, count: $number });
	expect(() => check(false, $Array($Thing))).toThrowErrorMatchingSnapshot();
	expect(() => check([false], $Array($Thing))).toThrowErrorMatchingSnapshot();
});
