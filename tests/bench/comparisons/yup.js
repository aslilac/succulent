import * as yup from "yup";
import { bench, intro, STRICT } from "../shared.js";

const $Type = yup.object({
	number: yup.number().required(),
	negNumber: yup.number().required(),
	maxNumber: yup.number().required(),
	string: yup.string().required(),
	long: yup.string().required(),
	bool: yup.bool().required(),
	deeplyNested: yup.object({
		hello: yup.string().required(),
		count: yup.number().required(),
		bool: yup.bool().required(),
	}),
});

export function start() {
	intro("yup");

	bench("loose", !STRICT, (v) => $Type.isValidSync(v));
	bench("exact", STRICT, null);
}

if (import.meta.main) {
	start();
}
