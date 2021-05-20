import { is } from "../operators";
import { $number } from "./number";

test("$number", () => {
	expect(is(0, $number)).toBe(true);
	expect(is(NaN, $number)).toBe(false);
	expect(is(false, $number)).toBe(false);
});
