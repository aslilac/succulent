import * as assert from "node:assert/strict";
import { Type, $Exact, $number, union, $literal, guard } from "succulent";

export const $Stuff = union(
	$Exact({
		type: $literal("one_number"),
		a: $number,
	}),
	$Exact({
		type: $literal("two_numbers"),
		a: $number,
		b: $number,
	}),
);

type Stuff = Type<typeof $Stuff>;

const a: Stuff = {
	type: "one_number",
	a: 1,
};

// @ts-expect-error - b is missing
const b: Stuff = {
	type: "two_numbers",
	a: 1,
};

const c: Stuff = {
	type: "one_number",
	a: 1,
	// @ts-expect-error - b is not allowed
	b: 2,
};

const d: Stuff = {
	type: "two_numbers",
	a: 1,
	b: 2,
};

guard(a, $Stuff);
assert.throws(() => guard(b, $Stuff));
assert.throws(() => guard(c, $Stuff));
guard(d, $Stuff);
