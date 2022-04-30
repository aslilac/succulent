/// <reference types="jest" />

import { createErrorRef, is, $bigint, $finite, $int, $number } from "../index";

test("$finite", () => {
	expect(is(0, $finite)).toBe(true);
	expect(is(Number.POSITIVE_INFINITY, $finite)).toBe(false);
	expect(is(Number.NEGATIVE_INFINITY, $finite)).toBe(false);
});

test("$int", () => {
	expect(is(0, $int)).toBe(true);
	expect(is(1, $int)).toBe(true);
	expect(is(0.5, $int)).toBe(false);
});

test("$number", () => {
	expect(is(0, $number)).toBe(true);
	expect(is(0, 0)).toBe(true);
	expect(is(1, 0)).toBe(false);
	expect(is(NaN, $number)).toBe(false);
	expect(is(false, $number)).toBe(false);

	const ref = createErrorRef();
	expect(is(0n, 0, ref)).toBe(false);
	expect(ref.error).toMatchSnapshot();
});

test("$bigint", () => {
	const bigintRef = createErrorRef();

	expect(is(0n, $bigint)).toBe(true);
	expect(is(0, $bigint, bigintRef)).toBe(false);
	expect(bigintRef.error).toMatchSnapshot();

	const literalRef = createErrorRef();

	expect(is(0n, 0n)).toBe(true);
	expect(is(0, 0n, literalRef)).toBe(false);
	expect(literalRef.error).toMatchSnapshot();
});
