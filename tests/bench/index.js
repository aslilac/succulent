import * as benchmark from "./benchmark.js";

// Us :)
benchmark.start();

// Competitors >:)
try {
	const runtypes = await import("./comparisons/runtypes.js");
	runtypes.start();
} catch (e) {
	console.error("runtypes benchmark failed:");
	console.error(error);
}

try {
	const yup = await import("./comparisons/yup.js");
	yup.start();
} catch (error) {
	console.error("yup benchmark failed:");
	console.error(error);
}

try {
	const zod = await import("./comparisons/zod.js");
	zod.start();
} catch (error) {
	console.error("zod benchmark failed:");
	console.error(error);
}
