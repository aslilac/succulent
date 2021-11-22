import { is } from "../operators";
import { $boolean, $NaN, $null, $undefined } from "./constants";

test("$boolean", () => {
	expect(is(true, $boolean)).toBe(true);
	expect(is(false, $boolean)).toBe(true);

	expect(is(0, $boolean)).toBe(false);
	expect(is(null, $boolean)).toBe(false);
});

test("$NaN", () => {
	expect(is(NaN, $NaN)).toBe(true);
	expect(is(0, $NaN)).toBe(false);
});

test("$null", () => {
	expect(is(null, $null)).toBe(true);
	expect(is(undefined, $null)).toBe(false);
});

test("$undefined", () => {
	expect(is(undefined, $undefined)).toBe(true);
	expect(is(null, $undefined)).toBe(false);
});
