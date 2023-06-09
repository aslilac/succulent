import * as assert from "node:assert/strict";
import { $Exact, guard } from "succulent";

const noPrototype = Object.assign(Object.create(null), { a: 1 });
guard(noPrototype, $Exact({ a: 1 }));
assert.throws(() => guard(noPrototype, $Exact({ a: 2 })));
