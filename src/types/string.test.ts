import { is, union } from "../operators";
import { $string } from "./string";

test("$string", () => {
	expect(is("hi", $string)).toBe(true);
	expect(is("hi", "hi")).toBe(true);
	expect(is("hey", "hi")).toBe(false);
	expect(is("hey", union("hi", "hey"))).toBe(true);
	expect(is(0, $string)).toBe(false);
});
