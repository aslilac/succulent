import { Schema } from "../schema";

/**
 * Probably shouldn't be used very frequently, but occasionally useful for
 * stuff like `$array($any)` or just specifying that an object should have a
 * key, without needing to specify the whole type. Basically the same kind of
 * cases you might want to use it in TypeScript.
 */
export const $any = new Schema((x: unknown): x is any => true);
