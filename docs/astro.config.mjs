import { defineConfig } from "astro/config";

// Local dev mounts at /, production build mounts under /succulent so the same
// codebase can serve from mckayla.dev/succulent without `astro dev` needing to
// run at /succulent/ locally.
const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
	site: "https://mckayla.dev",
	base: isProd ? "/succulent" : "/",
	trailingSlash: "ignore",
});
