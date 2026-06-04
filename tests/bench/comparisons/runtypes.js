import * as rt from "runtypes";
import { bench, intro, STRICT } from "../shared.js";

const $Type = rt.Object({
	number: rt.Number,
	negNumber: rt.Number,
	maxNumber: rt.Number,
	string: rt.String,
	long: rt.String,
	bool: rt.Boolean,
	deeplyNested: rt.Object({
		hello: rt.String,
		count: rt.Number,
		bool: rt.Boolean,
	}),
});

export function start() {
	intro("runtypes");

	bench("loose", !STRICT, (v) => $Type.inspect(v).success);
	bench("exact", STRICT, null);
}

if (import.meta.main) {
	start();
}
