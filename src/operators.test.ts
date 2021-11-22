import { is, union } from "./operators";
import { $literal } from "./types/misc";

test("is", () => {
	expect(is("hi", "hello")).toBe(false);
	expect(is("hello", "hello")).toBe(true);
});

test("union", () => {
	expect(is(0, union(0, 1, 2, 3, 4))).toBe(true);
	expect(is(5, union(0, 1, 2, 3, 4))).toBe(false);

	expect(is("a", union($literal("a"), $literal("b")))).toBe(true);
	expect(is("b", union($literal("a"), $literal("b")))).toBe(true);
	expect(is("c", union($literal("a"), $literal("b")))).toBe(false);

	expect(is("a", union($literal("a"), "b"))).toBe(true);
	expect(is("b", union($literal("a"), "b"))).toBe(true);
	expect(is("c", union($literal("a"), "b"))).toBe(false);
});
