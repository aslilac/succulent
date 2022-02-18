import { is, union, $symbol } from "../index";

test("$symbol", () => {
	const test = Symbol("test");

	expect(is(test, $symbol)).toBe(true);
	expect(is(test, Symbol.for("test"))).toBe(false);
	expect(is(Symbol.for("test"), Symbol.for("test"))).toBe(true);
	expect(is(0, $symbol)).toBe(false);
	expect(is(test, union(Symbol.for("test"), test))).toBe(true);
});
