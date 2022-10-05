/// <reference types="jest" />
import { assertType } from "../_util";
import { is, union, $literal, $string } from "../index";

test("union", () => {
	expect(is(0, union(0, 1, 2, 3, 4))).toBe(true);
	expect(is(5, union(0, 1, 2, 3, 4))).toBe(false);

	expect(is("a", union($literal("a"), "b"))).toBe(true);
	expect(is("b", union($literal("a"), "b"))).toBe(true);
	expect(is("c", union($literal("a"), "b"))).toBe(false);

	function _(x: unknown) {
		if (is(x, union($string, 0))) {
			if (is(x, union("hello", 0))) {
				assertType<"hello" | 0, typeof x>(x);
				assertType<typeof x, "hello" | 0>(x);
			}
		}
	}
});
