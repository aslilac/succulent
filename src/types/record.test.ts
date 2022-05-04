/// <reference types="jest" />
import { is, union, $Record, $string } from "../index";

test("$Record", () => {
	const inst = {
		a: "hi",
		b: "hey",
		c: "hello",
		d: "howdy",
		e: "hola",
	};

	const schema = $Record($string, $string);

	expect(is({}, schema)).toBe(true);
	expect(is(inst, schema)).toBe(true);
	expect(is({ ...inst, f: false }, schema)).toBe(false);

	const specific = $Record(union("a", "b", "c"), $string);

	expect(is({ a: "a", b: "b", c: "c" }, specific)).toBe(true);
	expect(is(inst, specific)).toBe(true);
	expect(is({}, specific)).toBe(false);
});
