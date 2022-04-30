/// <reference types="jest" />
import { check, is, $anyobject, $boolean, $map, $number, $set } from "../index";

test("$map", () => {
	const example = new Map([
		[true, {}],
		[false, {}],
	]);

	expect(is(example, $map($boolean, $anyobject))).toBe(true);
	expect(is(example, $map($number, $anyobject))).toBe(false);
	expect(is(example, $map($boolean, $number))).toBe(false);

	expect(() => check(example, $map($boolean, $number))).toThrowErrorMatchingSnapshot();
});

test("$set", () => {
	const example = new Set([true, false]);

	expect(is(example, $set($boolean))).toBe(true);
	expect(is(example, $set($number))).toBe(false);

	expect(() => check(example, $set($number))).toThrowErrorMatchingSnapshot();
});
