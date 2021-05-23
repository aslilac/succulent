// @ts-nocheck
import { is, union } from "./operators";

test("is", () => {
	expect(is("hi", "hello")).toBe(false);
	expect(is("hello", "hello")).toBe(true);

	expect(is(0, union(0, 1, 2, 3, 4))).toBe(true);
	expect(is(5, union(0, 1, 2, 3, 4))).toBe(false);
});
