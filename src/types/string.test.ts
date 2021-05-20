import { is } from "../operators";
import { $string } from "./string";

test("$string", () => {
	expect(is("hi", $string)).toBe(true);
	expect(is(0, $string)).toBe(false);
});
