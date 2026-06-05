import { Schema } from "../schema.js";

/**
 * lazy allows you to reference identifiers that may not exist yet when you're
 * defining your schema by constructing it at validation time. Use this whenever
 * a schema needs to reference itself, participate in a cycle of schemas, or
 * when a type might not be available (ie. checking for a Node/browser specific
 * constructor).
 *
 * Recursive schemas built with `lazy` are safe against self-referential values.
 *
 * @example
 * ```ts
 * type Friend = { name: string; friends: Friend[] };
 * const $Friend = $interface({
 *   name: $string,
 *   friends: $Array(lazy(() => $Friend)),
 * });
 *
 * const me = { name: "me", friends: [] };
 * me.friends.push(me); // circular references are fine
 * is(me, $Friend); // true
 * ```
 *
 * @remarks
 * Cycle protection only applies to recursion that goes through `lazy`. Raw
 * user-defined predicates (`new Schema((x) => $X.check(x))`) that re-enter
 * themselves without going through `lazy` will certainly stack-overflow. Use
 * `Schema` directly at your own risk.
 */
export function lazy<T>(func: () => Schema<T>) {
	const visiting = new WeakSet<object>();

	return new Schema(
		(t: unknown): t is T => {
			// Primitives can't cycle, so check them first.
			if (t === null || typeof t !== "object") {
				return func().check(t);
			}

			// If we re-enter with an object we've already seen higher up the stack,
			// then we won't find anyone breaking the schema rules by checking it all
			// again, so we just return `true`. If everything else passes inspection
			// then all is well. Isolating this to `lazy` means normal non-recursive
			// values never pay this tax.
			if (visiting.has(t)) {
				return true;
			}
			visiting.add(t);
			try {
				return func().check(t);
			} finally {
				visiting.delete(t);
			}
		},
		{ displayName: "lazy" },
	);
}
