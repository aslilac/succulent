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
	expect(is(new Array(10), undefinedArray)).toBe(true);
	expect(is(new Array(10), numArray)).toBe(false);

	const numArrayAllowEmpty = $array($number, { allowEmpty: true });
	expect(is(new Array(10), numArrayAllowEmpty)).toBe(true);
	expect(is(new Array(10).fill(0), numArrayAllowEmpty)).toBe(true);
	expect(is([1, 2, 3, 4, 5, undefined], numArrayAllowEmpty)).toBe(false);

	is<number[]>([], [$number]);
	is<number[]>([], [0]);
	is<number[]>([], [$number]);
	is<number[][]>([], [[$number]]);
	is<number[][][]>([], [[[$number]]]);
});
