/// <reference types="jest" />
import { assertType } from "../_util";
import { check, is, $boolean, $number, $string, $Tuple } from "../index";

test("$tuple", () => {
	const strings = $Tuple($string, $string, $string);
	const various = $Tuple($string, $number, $boolean);

	expect(is(["hi", "hey"], strings)).toBe(false);
	expect(is(["hi", "hey", "hello"], strings)).toBe(true);
	expect(is(["hi", "hey", "hello", "howdy"], strings)).toBe(false);
	expect(is(["hi", "hey", "hello"], various)).toBe(false);
	expect(is(["hi", 0, false], strings)).toBe(false);
	expect(is(["hi", 0, false], various)).toBe(true);

	expect(() => check(["hi", "hi"], strings)).toThrowErrorMatchingSnapshot();
	expect(() =>
		check(["hi", "hi", "hi", "howdy"], strings),
	).toThrowErrorMatchingSnapshot();

	type Strings = [string, string, string];
	type Various = [string, number, boolean];
	function _(x: unknown) {
		if (is(x, strings)) assertType<Strings, typeof x>(x);
		if (is(x, various)) assertType<Various, typeof x>(x);
	}
});
