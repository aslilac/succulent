/// <reference types="jest" />

import { guard, $any, $never, $string } from "../";

import { assertType } from "../_util";

test("guard", () => {
	const value: unknown = "hi friend!";

	expect(guard(value, $any)).toBe(value);
	expect(() => guard(value, $never)).toThrow();

	function _(x: unknown) {
		const validatedX = guard(x, $string);

		assertType<string, typeof validatedX>(validatedX);
	}
});
