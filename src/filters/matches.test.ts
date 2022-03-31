/// <reference types="jest" />

import { is, matches, $string } from "../index";

const $email = $string.that(matches(/[A-Za-z0-9_-]{1,}\@hey\.com/));

test("matches", () => {
	// Obviously this is a valid email address, but it doesn't match the test
	expect(is("hello@gmail.com", $email)).toBe(false);
	expect(is("hello@hey.com", $email)).toBe(true);
});
