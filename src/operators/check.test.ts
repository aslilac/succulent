import { assertType } from "../_util.js";
import {
	check,
	is,
	lazy,
	type Schema,
	$any,
	$interface,
	$never,
	$string,
} from "../index.js";

test("check", () => {
	const value: unknown = "hi friend!";

	expect(() => check(value, $any)).not.toThrow();
	expect(() => check(value, $never)).toThrow();

	function _(x: unknown) {
		check(x, $string);

		assertType<string, typeof x>(x);
	}
});

// Self-referential values shouldn't blow the stack — see issue #7.
test("check accepts self-referential values", () => {
	type Loop = { me: Loop };
	const $Loop: Schema<Loop> = $interface({ me: lazy(() => $Loop) });

	const loop: any = {};
	loop.me = loop;

	expect(is(loop, $Loop)).toBe(true);
	expect(() => check(loop, $Loop)).not.toThrow();
});

test("check rejects self-referential values whose structure is wrong", () => {
	type Loop = { me: Loop; name: string };
	const $Loop: Schema<Loop> = $interface({
		me: lazy(() => $Loop),
		name: $string,
	});

	const loop: any = {};
	loop.me = loop;
	// `name` is missing, so the structure is wrong even though the cycle is fine.

	expect(is(loop, $Loop)).toBe(false);
	expect(() => check(loop, $Loop)).toThrow();
});
