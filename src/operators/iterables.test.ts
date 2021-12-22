import { is } from "./is";
import { oneOf } from "./iterables";

test("oneOf", () => {
	type ExampleKey = "a" | "b" | "c";
	const example = new Map<ExampleKey, number>([
		["a", 0],
		["b", 1],
		["c", 2],
	]);

	expect(is("a", oneOf(example.keys()))).toBe(true);
	expect(is("d", oneOf(example.keys()))).toBe(false);
});
