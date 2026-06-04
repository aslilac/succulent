import { assertType } from "../_util.js";
import { check, $any, $never, $string } from "../index.js";

test("check", () => {
	const value: unknown = "hi friend!";

	expect(() => check(value, $any)).not.toThrow();
	expect(() => check(value, $never)).toThrow();

	function _(x: unknown) {
		check(x, $string);

		assertType<string, typeof x>(x);
	}
});
