/// <reference types="jest" />

import {
	check,
	is,
	$boolean,
	$literal,
	$monotuple,
	$number,
	$string,
	$tuple,
} from "../index";

import { assertType } from "../_util";

test("$tuple", () => {
	const strings = $tuple($string, $string, $string);
	const various = $tuple($string, $number, $boolean);

	expect(is(["hi", "hey"], strings)).toBe(false);
	expect(is(["hi", "hey", "hello"], strings)).toBe(true);
	expect(is(["hi", "hey", "hello", "howdy"], strings)).toBe(false);
	expect(is(["hi", "hey", "hello"], various)).toBe(false);
	expect(is(["hi", 0, false], strings)).toBe(false);
	expect(is(["hi", 0, false], various)).toBe(true);

	type Strings = [string, string, string];
	type Various = [string, number, boolean];
	function _(x: unknown) {
		if (is(x, strings)) assertType<Strings, typeof x>(x);
		if (is(x, various)) assertType<Various, typeof x>(x);
	}
});

test("$monotuple", () => {
	const triplet = $monotuple($string, 3);
	const hiTriplet = $monotuple($literal("hi"), 3);

	expect(is(["hi", "hi"], triplet)).toBe(false);
	expect(is(["hi", "hi", "hi"], triplet)).toBe(true);
	expect(is(["hi", "hi", "hi", "howdy"], triplet)).toBe(false);

	expect(() => check(["hi", "hi"], triplet)).toThrowErrorMatchingSnapshot();
	expect(() =>
		check(["hi", "hi", "hi", "howdy"], triplet),
	).toThrowErrorMatchingSnapshot();

	expect(is(["hi", "hi"], hiTriplet)).toBe(false);
	expect(is(["hi", "hi", "hi"], hiTriplet)).toBe(true);
	expect(is(["hi", "hi", "hi", "howdy"], hiTriplet)).toBe(false);

	expect(() => check(["hi", "hi"], hiTriplet)).toThrowErrorMatchingSnapshot();
	expect(() =>
		check(["hi", "hi", "hi", "howdy"], hiTriplet),
	).toThrowErrorMatchingSnapshot();

	function _(x: unknown) {
		if (is(x, triplet)) assertType<[string, string, string], typeof x>(x);
		if (is(x, hiTriplet)) assertType<["hi", "hi", "hi"], typeof x>(x);
	}
});
