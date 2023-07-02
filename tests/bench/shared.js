import chalk from "chalk";
import {
	missingShallow,
	missingDeep,
	valid,
	extraShallow,
	extraDeep,
} from "../testdata/benchSamples.js";

export function assert(v, message) {
	if (!v) {
		throw new Error(message);
	}
}

export function intro(name) {
	console.log(chalk.green("==>"), chalk.bold(name));
}

export const STRICT = true;

export function bench(name, strict, func) {
	if (!func) {
		console.log(`  ${name}`, chalk.gray.italic("unimplemented"));
		return;
	}

	for (let i = 0; i < 10000; i++) {
		assert(!func(missingShallow), "failed missingShallow");
		assert(!func(missingDeep), "failed missingDeep");
		assert(func(valid), "failed valid");
		assert(!func(extraShallow) === strict, "failed extraShallow");
		assert(!func(extraDeep) === strict, "failed extraDeep");
	}

	const start = performance.now();

	for (let i = 0; i < 10000; i++) {
		assert(!func(missingShallow), "failed missingShallow");
		assert(!func(missingDeep), "failed missingDeep");
		assert(func(valid), "failed valid");
		assert(!func(extraShallow) === strict, "failed extraShallow");
		assert(!func(extraDeep) === strict, "failed extraDeep");
	}

	const end = performance.now();
	const seconds = (end - start) / 1000;

	console.log(
		`  ${name}`,
		seconds.toPrecision(4),
		"seconds,",
		Math.floor(500000 / seconds),
		"ops/sec",
	);
}
