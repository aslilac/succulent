import { is, $anyobject, $boolean, $map, $number, $set } from "succulent";

test("$map", () => {
	const example = new Map([
		[true, {}],
		[false, {}],
	]);

	expect(is(example, $map($boolean, $anyobject))).toBe(true);
	expect(is(example, $map($number, $anyobject))).toBe(false);
	expect(is(example, $map($boolean, $number))).toBe(false);
});

test("$set", () => {
	const example = new Set([true, false]);

	expect(is(example, $set($boolean))).toBe(true);
	expect(is(example, $set($number))).toBe(false);
});
