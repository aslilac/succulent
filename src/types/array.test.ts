/// <reference types="jest" />
import {
	check,
	createErrorRef,
	is,
	$array,
	$number,
	$object,
	$string,
	$undefined,
} from "../index";

test("$array", () => {
	const numArray = $array($number);
	expect(is([], numArray)).toBe(true);
	expect(is([1], numArray)).toBe(true);
	expect(is([1, 2, 3, 4, 5], numArray)).toBe(true);

	const ref = createErrorRef();
	expect(is([1, 2, 3, 4, 5, undefined], numArray, ref)).toBe(false);
	expect(ref.error).toMatchSnapshot();

	const undefinedArray = $array($undefined);
	expect(is(new Array(100), undefinedArray)).toBe(true);
	expect(is(new Array(100), numArray)).toBe(false);

	const $Thing = $object({ name: $string, count: $number });

	expect(() => check(false, $array($Thing))).toThrowErrorMatchingSnapshot();
	expect(() => check([false], $array($Thing))).toThrowErrorMatchingSnapshot();
});
