import { is } from "succulent";

test("is", () => {
	expect(is("hi", "hello")).toBe(false);
	expect(is("hello", "hello")).toBe(true);
});
