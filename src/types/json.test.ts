import { is } from "../operators";
import { $json, $jsonarray, $jsonobject } from "./json";

test("$json", () => {
	expect(is(null, $json)).toBe(false);
	expect(is({}, $json)).toBe(false);
	expect(is([], $json)).toBe(false);
	expect(is("", $json)).toBe(false);

	expect(is("null", $json)).toBe(true);
	expect(is("{}", $json)).toBe(true);
	expect(is("[]", $json)).toBe(true);
	expect(is("0", $json)).toBe(true);
	expect(is('""', $json)).toBe(true);
	expect(is("true", $json)).toBe(true);
});

test("$jsonobject", () => {
	expect(is("null", $jsonobject)).toBe(false);
	expect(is("{}", $jsonobject)).toBe(true);
	expect(is("[]", $jsonobject)).toBe(false);
	expect(is("0", $jsonobject)).toBe(false);
	expect(is('""', $jsonobject)).toBe(false);
	expect(is("true", $jsonobject)).toBe(false);
});

test("$jsonarray", () => {
	expect(is("null", $jsonarray)).toBe(false);
	expect(is("{}", $jsonarray)).toBe(false);
	expect(is("[]", $jsonarray)).toBe(true);
	expect(is("0", $jsonarray)).toBe(false);
	expect(is('""', $jsonarray)).toBe(false);
	expect(is("true", $jsonarray)).toBe(false);
});
