import { assertType } from "../_util";
import { $boolean, $string } from "../types";
import { check } from "./check";

test("check", () => {
	const x: unknown = "hi friend!";

	expect(check(x, $string)).toBe(x);
	expect(() => check(x, $boolean)).toThrowError();

	function _(x: unknown) {
		const value = check(x, $string);

		assertType<string, typeof value>(value);
	}
});
