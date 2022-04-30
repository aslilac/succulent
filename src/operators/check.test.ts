/// <reference types="jest" />
import { assertType } from "../_util";
import { guard, $any, $never, $string } from "../index";

test("guard", () => {
	const value: unknown = "hi friend!";

	expect(guard(value, $any)).toBe(value);
	expect(() => guard(value, $never)).toThrow();

	function _(x: unknown) {
		const validatedX = guard(x, $string);

		assertType<string, typeof validatedX>(validatedX);
	}
});
