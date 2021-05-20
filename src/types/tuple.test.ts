import { assertType } from "../_util";
import { is } from "../operators";
import { $boolean } from "./constants";
import { $number } from "./number";
import { $string } from "./string";
import { $tuple } from "./tuple";

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
