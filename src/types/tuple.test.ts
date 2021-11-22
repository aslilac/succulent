import { assertType } from "../_util";
import { is } from "../operators";
import { $boolean } from "./constants";
import { $literal } from "./misc";
import { $number } from "./number";
import { $string } from "./string";
import { $monotuple, $tuple } from "./tuple";

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

	expect(is(["hi", "hey"], triplet)).toBe(false);
	expect(is(["hi", "hey", "hello"], triplet)).toBe(true);
	expect(is(["hi", "hey", "hello", "howdy"], triplet)).toBe(false);

	expect(is(["hi", "hi"], triplet)).toBe(false);
	expect(is(["hi", "hi", "hi"], triplet)).toBe(true);
	expect(is(["hi", "hi", "hi", "hi"], triplet)).toBe(false);

	function _(x: unknown) {
		if (is(x, triplet)) assertType<[string, string, string], typeof x>(x);
		if (is(x, hiTriplet)) assertType<["hi", "hi", "hi"], typeof x>(x);
	}
});
