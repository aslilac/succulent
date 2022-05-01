/// <reference types="jest" />
import { assertType } from "../_util";
import { check, guard, $any, $never, $string } from "../index";

test("check", () => {
	const value: unknown = "hi friend!";

	expect(check(value, $any)).toBe(value);
	expect(guard(value, $any)).toBe(value);
	expect(() => check(value, $never)).toThrow();

	function _(x: unknown) {
		const validatedX = check(x, $string);

		assertType<string, typeof validatedX>(validatedX);
	}
});
