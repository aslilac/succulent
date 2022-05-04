/// <reference types="jest" />
import { check, is, $anyobject, $boolean, $Map, $number, $Set } from "../index";

test("$Map", () => {
	const example = new Map([
		[true, {}],
		[false, {}],
	]);

	expect(is(example, $Map($boolean, $anyobject))).toBe(true);
	expect(is(example, $Map($number, $anyobject))).toBe(false);
	expect(is(example, $Map($boolean, $number))).toBe(false);

	expect(() => check(example, $Map($boolean, $number))).toThrowErrorMatchingSnapshot();
});

test("$Set", () => {
	const example = new Set([true, false]);

	expect(is(example, $Set($boolean))).toBe(true);
	expect(is(example, $Set($number))).toBe(false);

	expect(() => check(example, $Set($number))).toThrowErrorMatchingSnapshot();
});
