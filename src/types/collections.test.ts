/// <reference types="jest" />
import { check, is, $object, $boolean, $Map, $number, $Set } from "../index";

test("$Map", () => {
	const example = new Map([
		[true, {}],
		[false, {}],
	]);

	expect(is(example, $Map($boolean, $object))).toBe(true);
	expect(is(example, $Map($number, $object))).toBe(false);
	expect(is(example, $Map($boolean, $number))).toBe(false);

	expect(() => check(example, $Map($boolean, $number))).toThrowErrorMatchingSnapshot();
});

test("$Set", () => {
	const example = new Set([true, false]);

	expect(is(example, $Set($boolean))).toBe(true);
	expect(is(example, $Set($number))).toBe(false);

	expect(() => check(example, $Set($number))).toThrowErrorMatchingSnapshot();
});
