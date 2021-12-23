import { guard, $any, $never, $string } from "succulent";

import { assertType } from "../_util";

test("guard", () => {
	const x: unknown = "hi friend!";

	expect(guard(x, $any)).toBe(x);
	expect(() => guard(x, $never)).toThrowError();

	function _(x: unknown) {
		const value = guard(x, $string);

		assertType<string, typeof value>(value);
	}
});
