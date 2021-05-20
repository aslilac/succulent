import { is } from "../operators";
import { $record } from "./record";
import { $string } from "./string";

test("$record", () => {
	const inst = {
		a: "hi",
		b: "hey",
		c: "hello",
		d: "howdy",
		e: "hola",
	};

	const schema = $record($string, $string);

	expect(is({}, schema)).toBe(true);
	expect(is(inst, schema)).toBe(true);
	expect(is({ ...inst, f: false }, schema)).toBe(false);
});
