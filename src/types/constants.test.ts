import { is, $boolean, $false, $NaN, $null, $true, $undefined } from "../index";

test("$boolean", () => {
	expect(is(true, $boolean)).toBe(true);
	expect(is(false, $boolean)).toBe(true);

	expect(is(0, $boolean)).toBe(false);
	expect(is(null, $boolean)).toBe(false);
});

test("$false", () => {
	expect(is(true, $false)).toBe(false);
	expect(is(false, $false)).toBe(true);
	expect(is(true, false)).toBe(false);
	expect(is(false, false)).toBe(true);
});

test("$true", () => {
	expect(is(true, $true)).toBe(true);
	expect(is(false, $true)).toBe(false);
	expect(is(true, true)).toBe(true);
	expect(is(false, true)).toBe(false);
});

test("$NaN", () => {
	expect(is(NaN, $NaN)).toBe(true);
	expect(is(NaN, NaN)).toBe(true);
	expect(is(0, $NaN)).toBe(false);
});

test("$null", () => {
	expect(is(null, $null)).toBe(true);
	expect(is(null, null)).toBe(true);
	expect(is(undefined, $null)).toBe(false);
	expect(is(undefined, null)).toBe(false);
});

test("$undefined", () => {
	expect(is(undefined, $undefined)).toBe(true);
	expect(is(undefined, undefined)).toBe(true);
	expect(is(null, $undefined)).toBe(false);
	expect(is(null, undefined)).toBe(false);
});
