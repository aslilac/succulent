import { is, union } from "./operators";
import { $literal } from "./types/misc";
import { $string } from "./types/string";
import { assertType } from "./_util";

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

	function _(x: unknown) {
		if (is(x, union($string, 0))) {
			if (is(x, union("hello", 0))) {
				assertType<"hello" | 0, typeof x>(x);

				// @ts-expect-error - This is a weird bug that comes from the combination
				// of unions and checking for $string, and *then* a string literal.
				// Seems to be an issue with tsc though, and not us
				// https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABFApgZygCgB4C5HgDWYcA7mAJSIDeAUAJAzCKZQCeADinM9ogLyDEAIgwAnGGADmwxAB85iPoP6IADFTr162Bo2Y4BQ4QAsUAG3NxZCpUdUaaenXoC+DdwyYsIZiIQBGHApNPV1tb0xfFH8AJmDQ7Rdtd3p3T1BIWAREaP8gvAIwYjJKfD4YNBZxSSl5dUSxFCgQMSR2Lh47FREa6RtFZSE1AG5aDPBoeCQ8wnjCohJyCnLESpZTCysbBqd6Jpa27uMzS2t5Qft1MdcgA
				assertType<typeof x, "hello" | 0>(x);
			}
		}
	}
});
