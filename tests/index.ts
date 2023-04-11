import { is, Type, $interface, $number, union, $literal } from "succulent";

export const $Stuff = union(
	$interface({
		type: $literal("one_number"),
		a: $number,
	}),
	$interface({
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

// @ts-expect-error
const b: Stuff = {
	type: "two_numbers",
	a: 1,
};

const c: Stuff = {
	type: "one_number",
	a: 1,
	// @ts-expect-error
	b: 2,
};

const d: Stuff = {
	type: "two_numbers",
	a: 1,
	b: 2,
};
