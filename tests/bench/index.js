import * as benchmark from "./benchmark.js";

import * as runtypes from "./comparisons/runtypes.js";
import * as yup from "./comparisons/yup.js";
import * as zod from "./comparisons/zod.js";

// Us :)
benchmark.start();

// Competitors >:)
runtypes.start();
yup.start();
zod.start();
