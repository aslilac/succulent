import { is } from "../operators";
import { $array } from "./array";
import { $undefined } from "./constants";
import { $number } from "./number";

test("$array", () => {
	const numArray = $array($number);
	expect(is([], numArray)).toBe(true);
	expect(is([1], numArray)).toBe(true);
	expect(is([1, 2, 3, 4, 5], numArray)).toBe(true);
	expect(is([1, 2, 3, 4, 5, undefined], numArray)).toBe(false);

	const undefinedArray = $array($undefined);
	expect(is(new Array(100), undefinedArray)).toBe(true);
	// XXX: I want this to be false, but empty items are a pain
	expect(is(new Array(100), numArray)).toBe(true);
});
