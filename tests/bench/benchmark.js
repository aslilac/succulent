import { is, $boolean, $Exact, $interface, $number, $string } from "succulent";
import { bench, intro, STRICT } from "./shared.js";

const $Type = $interface({
	number: $number,
	negNumber: $number,
	maxNumber: $number,
	string: $string,
	long: $string,
	bool: $boolean,
	deeplyNested: $interface({
		hello: $string,
		count: $number,
		bool: $boolean,
	}),
});

const $ExactType = $Exact({
	number: $number,
	negNumber: $number,
	maxNumber: $number,
	string: $string,
	long: $string,
	bool: $boolean,
	deeplyNested: $Exact({
		hello: $string,
		count: $number,
		bool: $boolean,
	}),
});

export function start() {
	intro("succulent");

	bench("loose", !STRICT, (v) => is(v, $Type));
	bench("exact", STRICT, (v) => is(v, $ExactType));
}

if (import.meta.main) {
	start();
}
