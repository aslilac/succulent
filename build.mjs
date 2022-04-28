#!/usr/bin/env node
import b from "esbuild-kit";

b({
	formats: ["cjs", "esm"],
});
