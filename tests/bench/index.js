import * as succulentBench from "./comparisons/succulent.js";
import * as runtypesBench from "./comparisons/runtypes.js";
import * as yupBench from "./comparisons/yup.js";
import * as zodBench from "./comparisons/zod.js";

// Us :)
succulentBench.start();

// Competitors >:)
runtypesBench.start();
yupBench.start();
zodBench.start();
