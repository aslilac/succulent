import * as z from "zod";
import { bench, intro, STRICT } from "../shared.js";

const $Type = z.object({
	number: z.number(),
	negNumber: z.number(),
	maxNumber: z.number(),
	string: z.string(),
	long: z.string(),
	bool: z.boolean(),
	deeplyNested: z.object({
		hello: z.string(),
		count: z.number(),
		bool: z.boolean(),
	}),
});

const $ExactType = z
	.object({
		number: z.number(),
		negNumber: z.number(),
		maxNumber: z.number(),
		string: z.string(),
		long: z.string(),
		bool: z.boolean(),
		deeplyNested: z
			.object({
				hello: z.string(),
				count: z.number(),
				bool: z.boolean(),
			})
			.strict(),
	})
	.strict();

export function start() {
	intro("zod");

	bench("loose", !STRICT, (v) => $Type.safeParse(v).success);
	bench("exact", STRICT, (v) => $ExactType.safeParse(v).success);
}

if (import.meta.main) {
	start();
}
