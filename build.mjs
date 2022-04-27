#!/usr/bin/env node
import b from "esbuild-kit";

const opts = { entryPoints: ["./src/index.ts"] };
const put = (x) => new URL(x, import.meta.url).pathname;

b(
	{ ...opts, outfile: put("./build/index.js"), format: "cjs" },
	{ ...opts, outfile: put("./build/index.mjs"), format: "esm" },
);
